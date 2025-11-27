import {Client} from '@stomp/stompjs'
import SockJS from 'sockjs-client'

// 백엔드 API의 기본 URL을 가져옵니다. STOMP 엔드포인트에 사용됩니다.
import {baseUrl as BASE_URL} from "@shared/types/common.ts"
import {isTokenExpired, getUserIdFromToken} from "@shared/utils/jwt"
import {api} from "@shared/api"


// 웹소켓을 통해 수신되는 채팅 메시지의 데이터 구조를 정의합니다.
export interface ChatWebSocketMessage {
    chatId: number; // 메시지 ID
    chatRoomId: number; // 채팅방 ID
    senderId: number; // 발신자 사용자 ID
    senderNickname: string; // 발신자 닉네임
    senderImgUrl?: string; // 발신자 프로필 이미지 URL (선택 사항)
    message: string; // 실제 메시지 내용
    read?: boolean; // 메시지 읽음 여부 (선택 사항)
    createdAt: string; // 메시지 생성 시간 (ISO 8601 형식)
    readAt?: string; // 메시지 읽음 시간 (선택 사항)
    mine?: boolean; // 현재 사용자의 메시지인지 클라이언트 측에서 판단하는 플래그 (선택 사항)
}

/**
 * STOMP over WebSocket 연결 및 채팅방 메시징을 관리하는 서비스 클래스입니다.
 */
export class ChatWebSocketService {
    private client: Client | null = null // STOMP 클라이언트 인스턴스
    private connected = false // 현재 연결 상태
    // 구독 ID를 관리하는 맵: key=chatRoomId, value=subscription ID
    private subscriptions: Map<number, string> = new Map()
    // 활성 구독 카운트 (모든 구독이 해제되면 연결 종료)
    private activeSubscriptionCount = 0
    // 재연결 시도 횟수 추적
    private reconnectAttempts = 0
    private readonly MAX_RECONNECT_ATTEMPTS = 3

    /**
     * ChatWebSocketService의 생성자입니다.
     * STOMP 클라이언트를 초기화하고 웹소켓 연결 설정을 구성합니다.
     */
    constructor() {
        this.client = new Client({
            // 웹소켓 연결 팩토리: SockJS를 사용하여 브라우저 호환성 및 대체(fallback) 지원을 제공합니다.
            webSocketFactory: () => new SockJS(`${BASE_URL}/ws-stomp`),
            reconnectDelay: 5000, // 연결 끊김 시 5초 후 재연결 시도
            heartbeatIncoming: 10000, // 서버에서 10초마다 하트비트 수신 예상 (백엔드와 동기화)
            heartbeatOutgoing: 10000, // 서버로 10초마다 하트비트 전송 (백엔드와 동기화)
            debug: (str) => {
                console.log('[STOMP Debug]', str) // STOMP 내부 디버그 로그 출력
            },
            // 재연결 전에 토큰을 갱신하는 콜백
            beforeConnect: async () => {
                console.log('[WebSocket] beforeConnect - checking token...')
                const token = localStorage.getItem('accessToken')

                // 토큰이 만료되었으면 갱신 시도
                if (isTokenExpired(token)) {
                    console.log('[WebSocket] Token expired before reconnect, refreshing...')
                    try {
                        await api.get('/v1/auth/status', { useJWT: true })
                        const newToken = localStorage.getItem('accessToken')
                        if (this.client && newToken) {
                            this.client.connectHeaders = {
                                Authorization: `Bearer ${newToken}`
                            }
                        }
                        console.log('[WebSocket] Token refreshed for reconnection')
                    } catch (error) {
                        console.error('[WebSocket] Failed to refresh token before reconnect:', error)
                        // 토큰 갱신 실패 시 재연결 중단
                        this.reconnectAttempts++
                        if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
                            console.error('[WebSocket] Max reconnect attempts reached, redirecting to home...')
                            window.location.href = '/'
                        }
                        throw error
                    }
                }
            }
        })
    }

    /**
     * 웹소켓 연결을 활성화하고 연결 상태가 될 때까지 기다립니다.
     * 토큰이 만료된 경우 자동으로 갱신을 시도합니다.
     * @param onConnected 연결 성공 시 실행될 콜백 함수
     * @param onError 연결 또는 STOMP 오류 발생 시 실행될 콜백 함수
     * @returns 연결이 설정될 때 resolve되는 Promise
     */
    async connect(onConnected?: () => void, onError?: (error: Error) => void): Promise<void> {
        if (!this.client) {
            const error = new Error('WebSocket client not initialized')
            onError?.(error)
            throw error
        }

        // 1. 토큰 유효성 확인 및 갱신
        let token = localStorage.getItem('accessToken')

        if (isTokenExpired(token)) {
            console.log('[WebSocket] Token expired, refreshing...')
            try {
                // /auth/status API를 호출하면 api.ts의 로직이 자동으로 토큰 갱신
                await api.get('/v1/auth/status', { useJWT: true })
                token = localStorage.getItem('accessToken') // 갱신된 토큰 가져오기
                console.log('[WebSocket] Token refreshed successfully')
            } catch (error) {
                console.error('[WebSocket] Token refresh failed:', error)
                const refreshError = new Error('Failed to refresh token')
                onError?.(refreshError)
                throw refreshError
            }
        }

        // 2. WebSocket 연결
        return new Promise((resolve, reject) => {
            // 연결 성공 시 핸들러
            this.client!.onConnect = () => {
                console.log('[WebSocket] Connected successfully')
                this.connected = true
                this.reconnectAttempts = 0 // 연결 성공 시 재연결 카운터 리셋
                onConnected?.()
                resolve()
            }

            // STOMP 프로토콜 수준 오류 핸들러
            this.client!.onStompError = (frame) => {
                const errorMsg = frame.headers['message']
                console.warn('[WebSocket] STOMP error:', errorMsg, frame.body)

                // 연결이 아직 완료되지 않았을 때 발생한 오류만 Promise를 reject합니다.
                if (!this.connected && errorMsg !== 'Invalid destination') {
                    const error = new Error(`STOMP error: ${errorMsg}`)
                    onError?.(error)
                    reject(error)
                }
            }

            // 웹소켓 연결 오류 핸들러
            this.client!.onWebSocketError = (event) => {
                const error = new Error('WebSocket connection error')
                console.error('[WebSocket] Connection error:', event)
                onError?.(error)
            }

            // 최신 토큰으로 연결 헤더 설정
            if (token) {
                this.client!.connectHeaders = {
                    Authorization: `Bearer ${token}`
                }
                console.log('[WebSocket] Connecting with fresh token...')
            } else {
                const error = new Error('No access token available')
                console.error('[WebSocket]', error.message)
                onError?.(error)
                reject(error)
                return
            }

            // STOMP 클라이언트 활성화
            this.client!.activate()
        })
    }

    /**
     * 활성화된 웹소켓 연결을 해제하고 모든 구독을 정리합니다.
     */
    disconnect() {
        if (this.client) {
            this.client.deactivate() // STOMP 클라이언트 비활성화
            this.connected = false
            this.subscriptions.clear() // 구독 목록 초기화
        }
    }

    /**
     * 특정 채팅방의 토픽을 구독하여 실시간 메시지를 수신합니다.
     * @param chatRoomId 구독할 채팅방의 ID
     * @param onMessage 메시지 수신 시 실행될 콜백 함수
     * @returns 구독을 해제하는 함수
     */
    subscribeToChatRoom(
        chatRoomId: number,
        onMessage: (message: ChatWebSocketMessage) => void
    ): () => void {
        if (!this.client || !this.connected) {
            throw new Error('WebSocket not connected')
        }

        // 채팅방 토픽에 구독을 설정합니다.
        try {
            const subscription = this.client.subscribe(
                // 구독할 대상 주소
                `/topic/chatroom.${chatRoomId}`,
                // 메시지 수신 핸들러
                (message) => {
                    try {
                        // 수신된 메시지 본문(JSON 문자열)을 파싱합니다.
                        const parsedMessage: ChatWebSocketMessage = JSON.parse(message.body)
                        onMessage(parsedMessage)
                    } catch (error) {
                        console.error('Failed to parse message:', error)
                    }
                },
                {
                    // 메시지 승인(ack) 모드: 'auto' (클라이언트가 자동 승인)
                    ack: 'auto'
                }
            )

            // 구독 정보를 맵에 저장하여 관리합니다.
            this.subscriptions.set(chatRoomId, subscription.id)
            this.activeSubscriptionCount++

            console.log(`Subscribed to /topic/chatroom.${chatRoomId} (active: ${this.activeSubscriptionCount})`)

            // 구독 해제 함수를 반환합니다.
            return () => {
                try {
                    subscription.unsubscribe()
                    this.subscriptions.delete(chatRoomId)
                    this.activeSubscriptionCount--
                    console.log(`Unsubscribed from /topic/chatroom.${chatRoomId} (active: ${this.activeSubscriptionCount})`)

                    // 모든 구독이 해제되면 WebSocket 연결도 끊기
                    if (this.activeSubscriptionCount === 0) {
                        console.log('No active subscriptions. Disconnecting WebSocket...')
                        this.disconnect()
                    }
                } catch (error) {
                    console.warn('Failed to unsubscribe:', error)
                }
            }
        } catch (error) {
            console.error('Failed to subscribe to chat room:', error)
            // 오류 발생 시 빈 구독 해제 함수를 반환합니다.
            return () => {
            }
        }
    }

    /**
     * 특정 채팅방으로 메시지를 전송합니다.
     * @param chatRoomId 메시지를 보낼 채팅방의 ID
     * @param content 전송할 메시지 내용
     */
    sendMessage(chatRoomId: number, content: string) {
        if (!this.client || !this.connected) {
            throw new Error('WebSocket not connected')
        }

        const token = localStorage.getItem('accessToken')
        const userId = getUserIdFromToken(token)

        if (!userId) {
            throw new Error('User ID not found in token')
        }

        const destination = '/app/chat.send' // 메시지 전송을 위한 STOMP 목적지
        const messageBody = JSON.stringify({
            chatRoomId: chatRoomId,
            senderId: userId,
            message: content  // 백엔드에서 기대하는 메시지 필드 이름
        })

        // 전송 시도 로깅
        console.log('[WebSocket] Sending message:', {
            destination,
            chatRoomId,
            senderId: userId,
            content,
            messageBody
        })

        try {
            // CONNECT 단계에서 이미 인증되었으므로 여기서는 JWT 불필요
            this.client.publish({
                destination,
                body: messageBody,
                headers: {
                    'content-type': 'application/json'
                }
            })
            console.log('[WebSocket] Message sent successfully')
        } catch (error) {
            console.error('[WebSocket] Failed to send message:', error)
            throw error
        }
    }

    /**
     * 현재 웹소켓 연결 상태를 반환합니다.
     * @returns 연결되어 있으면 true, 아니면 false
     */
    isConnected(): boolean {
        return this.connected
    }
}

// Singleton 인스턴스 패턴을 위한 변수
let wsInstance: ChatWebSocketService | null = null

/**
 * ChatWebSocketService의 싱글톤 인스턴스를 가져옵니다.
 * 인스턴스가 없으면 새로 생성하여 반환합니다.
 * @returns ChatWebSocketService의 단일 인스턴스
 */
export function getChatWebSocketService(): ChatWebSocketService {
    if (!wsInstance) {
        wsInstance = new ChatWebSocketService()
    }
    return wsInstance
}