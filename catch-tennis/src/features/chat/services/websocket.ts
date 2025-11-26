import {Client} from '@stomp/stompjs'
import SockJS from 'sockjs-client'

import {baseUrl as BASE_URL} from "@shared/types/common.ts"


export interface ChatWebSocketMessage {
    chatId: number;
    chatRoomId: number;
    senderId: number;
    senderNickname: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    readAt?: string;
}

export class ChatWebSocketService {
    private client: Client | null = null
    private connected = false
    private subscriptions: Map<number, string> = new Map()

    constructor() {
        this.client = new Client({
            // Use SockJS for fallback support
            webSocketFactory: () => new SockJS(`${BASE_URL}/ws-stomp`),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => {
                console.log('[STOMP Debug]', str)
            }
        })
    }

    connect(onConnected?: () => void, onError?: (error: Error) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.client) {
                const error = new Error('WebSocket client not initialized')
                onError?.(error)
                reject(error)
                return
            }

            this.client.onConnect = () => {
                this.connected = true
                onConnected?.()
                resolve()
            }

            this.client.onStompError = (frame) => {
                // Don't reject on subscription errors, just log them
                const errorMsg = frame.headers['message']
                console.warn('STOMP error:', errorMsg, frame.body)

                // Only reject on connection errors, not subscription errors
                if (!this.connected && errorMsg !== 'Invalid destination') {
                    const error = new Error(`STOMP error: ${errorMsg}`)
                    onError?.(error)
                    reject(error)
                }
            }

            this.client.onWebSocketError = (event) => {
                const error = new Error('WebSocket connection error')
                console.error('WebSocket error:', event)
                onError?.(error)
            }

            // Add JWT token to connection headers
            const token = localStorage.getItem('accessToken')
            if (token) {
                this.client.connectHeaders = {
                    Authorization: `Bearer ${token}`
                }
            }

            this.client.activate()
        })
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate()
            this.connected = false
            this.subscriptions.clear()
        }
    }

    subscribeToChatRoom(
        chatRoomId: number,
        onMessage: (message: ChatWebSocketMessage) => void
    ): () => void {
        if (!this.client || !this.connected) {
            throw new Error('WebSocket not connected')
        }

        // Subscribe to the chat room topic
        try {
            const subscription = this.client.subscribe(
                `/topic/chatroom.${chatRoomId}`,
                (message) => {
                    try {
                        const parsedMessage: ChatWebSocketMessage = JSON.parse(message.body)
                        onMessage(parsedMessage)
                    } catch (error) {
                        console.error('Failed to parse message:', error)
                    }
                },
                {
                    // Don't auto-ack, let the server handle it
                    ack: 'auto'
                }
            )

            this.subscriptions.set(chatRoomId, subscription.id)

            console.log(`Subscribed to /topic/chatroom.${chatRoomId}`)

            // Return unsubscribe function
            return () => {
                try {
                    subscription.unsubscribe()
                    this.subscriptions.delete(chatRoomId)
                    console.log(`Unsubscribed from /topic/chatroom.${chatRoomId}`)
                } catch (error) {
                    console.warn('Failed to unsubscribe:', error)
                }
            }
        } catch (error) {
            console.error('Failed to subscribe to chat room:', error)
            // Return empty unsubscribe function
            return () => {}
        }
    }

    sendMessage(chatRoomId: number, content: string) {
        if (!this.client || !this.connected) {
            throw new Error('WebSocket not connected')
        }

        const token = localStorage.getItem('accessToken')

        // Extract user ID from JWT token
        let userId: number | null = null
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]))
                userId = parseInt(payload.sub)
            } catch (error) {
                console.error('Failed to parse JWT token:', error)
            }
        }

        if (!userId) {
            throw new Error('User ID not found in token')
        }

        const destination = '/app/chat.send'
        const messageBody = JSON.stringify({
            chatRoomId: chatRoomId,
            senderId: userId,
            message: content  // 백엔드는 'message' 필드를 기대함
        })

        console.log('[WebSocket] Sending message:', {
            destination,
            chatRoomId,
            senderId: userId,
            content,
            messageBody,
            hasToken: !!token
        })

        try {
            this.client.publish({
                destination,
                body: messageBody,
                headers: {
                    ...(token && {Authorization: `Bearer ${token}`}),
                    'content-type': 'application/json'
                }
            })
            console.log('[WebSocket] Message sent successfully')
        } catch (error) {
            console.error('[WebSocket] Failed to send message:', error)
            throw error
        }
    }

    isConnected(): boolean {
        return this.connected
    }
}

// Singleton instance
let wsInstance: ChatWebSocketService | null = null

export function getChatWebSocketService(): ChatWebSocketService {
    if (!wsInstance) {
        wsInstance = new ChatWebSocketService()
    }
    return wsInstance
}
