import {useState, useEffect, useCallback, useRef} from 'react'
import {useParams, useNavigate} from 'react-router-dom'

// 사용자 정의 컴포넌트 및 유틸리티 타입/훅 임포트
import {MessageItem} from '../components/MessageItem' // 단일 메시지 아이템 렌더링 컴포넌트
import {useChatMessages} from '../hooks/useChatMessages' // REST API로 채팅 기록을 불러오는 훅
import {useWebSocket} from '../hooks/useWebSocket' // WebSocket 연결 및 메시지 송수신 훅
import {ImgLoader} from '@shared/components/atoms' // 로딩 스피너 컴포넌트
import SendIcon from '@/assets/icons/send.svg?react' // 메시지 전송 아이콘
import type {ChatMessage} from '../common' // 채팅 메시지 데이터 타입 정의
import type {ChatWebSocketMessage} from '../services/websocket' // WebSocket으로 수신되는 메시지 타입 정의

/**
 * 채팅방 메인 컴포넌트
 * URL 파라미터를 통해 roomId를 받아 해당 채팅방의 메시지 표시 및 송수신을 담당합니다.
 */
export function ChatRoom() {
    // URL 파라미터에서 roomId 추출
    const {roomId} = useParams<{roomId: string}>()
    // 페이지 이동을 위한 네비게이션 훅
    const navigate = useNavigate()

    // 사용자가 입력하는 메시지 상태
    const [messageInput, setMessageInput] = useState('')
    // REST API(이전 메시지)와 WebSocket(실시간 메시지)을 합친 최종 메시지 목록
    const [allMessages, setAllMessages] = useState<ChatMessage[]>([])

    // 이전에 불러온 REST 메시지 목록을 추적하여 불필요한 동기화/재렌더링을 방지
    const prevMessagesRef = useRef<ChatMessage[]>([])

    // roomId를 숫자로 변환 (useChatMessages 훅에 전달하기 위해)
    const roomIdNumber = roomId ? parseInt(roomId, 10) : NaN

    // REST API를 통해 채팅 메시지 기록을 불러오는 훅 (무한 스크롤 및 초기 로딩 담당)
    const {
        messages, // REST API에서 불러온 이전 메시지 목록
        loading, // 로딩 상태
        error, // 에러 상태
        hasNext, // 추가로 불러올 메시지가 있는지 여부
        loadMore, // 이전 메시지를 추가로 불러오는 함수
        scrollRef, // 메시지 목록 div의 ref (스크롤 위치 제어용)
        scrollToBottom // 스크롤을 맨 아래로 이동시키는 함수
    } = useChatMessages(roomIdNumber)

    /**
     * WebSocket으로부터 실시간 메시지를 수신했을 때 호출되는 콜백 함수
     */
    const handleMessageReceived = useCallback((wsMessage: ChatWebSocketMessage) => {
        // WebSocket 메시지 형태를 내부 ChatMessage 타입으로 변환
        const newMessage: ChatMessage = {
            chatId: wsMessage.chatId,
            chatRoomId: wsMessage.chatRoomId,
            senderId: wsMessage.senderId,
            senderNickname: wsMessage.senderNickname,
            senderImgUrl: wsMessage.senderImgUrl,
            message: wsMessage.message,
            createdAt: wsMessage.createdAt,
            read: wsMessage.read,
            readAt: wsMessage.readAt,
            mine: wsMessage.mine // 실시간 메시지에서도 내 메시지 여부 플래그 사용 가능
        }

        // 전체 메시지 목록에 새로운 메시지 추가
        setAllMessages(prev => [...prev, newMessage])

        // 메시지 추가 후, DOM 업데이트를 기다린 다음 스크롤을 맨 아래로 이동
        setTimeout(() => {
            scrollToBottom()
        }, 100)
    }, [scrollToBottom]) // scrollToBottom 함수가 변경될 때만 재생성

    // WebSocket 연결 상태 및 메시지 전송 함수를 제공하는 훅
    const {connected, sendMessage} = useWebSocket(
        roomIdNumber,
        handleMessageReceived // 메시지 수신 시 처리할 콜백 전달
    )

    // [핵심 로직: REST 메시지와 실시간 WS 메시지 동기화]
    // messages (REST)가 변경될 때마다 allMessages 상태를 업데이트합니다.
    useEffect(() => {
        // 불필요한 업데이트 방지: 이전 messages와 현재 messages가 동일하면(참조 동일) 종료
        if (prevMessagesRef.current === messages) return
        prevMessagesRef.current = messages // 현재 메시지 목록을 이전 참조로 저장

        setAllMessages(prev => {
            // 1. allMessages가 비어있으면 (초기 로딩), REST 메시지 전체를 그대로 사용
            if (prev.length === 0) {
                return messages
            }

            // 2. 메시지 ID를 기반으로 현재 REST 메시지 목록에 있는 ID Set 생성
            const restMessageIds = new Set(messages.map(m => m.chatId))

            // 3. 기존 allMessages 중에서 REST 메시지 목록에 없는 메시지(WS로 수신된 메시지)만 필터링
            //    -> 이 메시지들은 새로 불러온 이전 기록과 중복되지 않는 실시간 메시지입니다.
            const wsOnlyMessages = prev.filter(m => !restMessageIds.has(m.chatId))

            // 4. 새로 불러온 REST 메시지 목록 뒤에 WS 전용 메시지를 붙여 최종 목록 생성
            //    -> 이렇게 하면 REST 기록이 업데이트될 때 실시간 메시지가 유지됩니다.
            return [...messages, ...wsOnlyMessages]
        })
    }, [messages]) // messages (REST 기록)가 변경될 때마다 실행

    // [잘못된 roomId 처리]
    if (!roomId || Number.isNaN(roomIdNumber)) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-text-muted">잘못된 채팅방입니다.</p>
            </div>
        )
    }

    // === 파생 값들 계산 로직 ===

    // `mine=true`인 첫 메시지를 기준으로 현재 사용자 ID를 찾습니다.
    const myMessage = allMessages.find(msg => msg.mine === true)

    // JWT 토큰을 파싱하여 사용자 ID를 추출하는 로직
    let tokenUserId: number | null = null
    const token = localStorage.getItem('accessToken')
    if (token) {
        try {
            // JWT는 'header.payload.signature' 구조이므로 payload 부분(두 번째 요소)을 추출
            const payloadBase64 = token.split('.')[1]
            // Base64 디코딩 및 JSON 파싱
            const payload = JSON.parse(atob(payloadBase64))
            // 'sub' (subject) 필드에서 사용자 ID(문자열)를 추출 후 숫자로 변환
            const userId = parseInt(payload.sub)
            if (!Number.isNaN(userId)) {
                tokenUserId = userId
            }
        } catch (error) {
            console.error('Failed to parse JWT token:', error)
            // 에러 발생 시 사용자에게 직접적인 영향은 주지 않도록 alert 대신 console.error만 사용
        }
    }

    // 최종적으로 사용할 현재 사용자 ID 결정
    // 1. 메시지 목록에서 `mine=true` 플래그가 있는 메시지의 senderId를 우선 사용
    // 2. 없으면 JWT 토큰에서 추출한 userId 사용
    const currentUserId: number | null = myMessage
        ? myMessage.senderId
        : tokenUserId

    /**
     * 메시지 전송 버튼 클릭 핸들러
     */
    const handleSendMessage = () => {
        const trimmedMessage = messageInput.trim()
        if (trimmedMessage && connected) { // 메시지 내용이 있고, WebSocket이 연결되어 있어야 전송 가능
            try {
                sendMessage(trimmedMessage) // WebSocket을 통해 메시지 전송
                setMessageInput('') // 성공 후 입력 필드 초기화
            } catch (error) {
                console.error('Failed to send message:', error)
                // 사용자에게 전송 실패 알림 (Modal/Toast 등으로 대체하는 것이 좋음, alert() 사용 지양)
                // TODO: 실제 구현에서는 alert() 대신 UI 컴포넌트 사용 권장
                alert('메시지 전송에 실패했습니다.')
            }
        }
    }

    /**
     * 입력 필드 키보드 입력 핸들러 (Enter 키로 전송)
     */
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Enter 키를 누르고 Shift 키를 누르지 않았을 때
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault() // 기본 Enter 동작(줄바꿈) 방지
            handleSendMessage() // 메시지 전송 함수 호출
        }
    }

    // [초기 로딩 상태 처리]
    // 메시지 목록이 비어 있고 로딩 중일 때 로딩 스피너 표시
    if (loading && messages.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <ImgLoader imgType="loading" imgSize="large" />
            </div>
        )
    }

    // [에러 상태 처리]
    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-text-muted">메시지를 불러오는데 실패했습니다.</p>
            </div>
        )
    }

    // 상대방 닉네임 결정
    // 현재 사용자가 아닌 다른 사용자의 닉네임을 찾아서 표시, 없으면 '채팅'으로 기본값 설정
    const opponentNickname =
        allMessages.find(msg => msg.senderId !== currentUserId)?.senderNickname || '채팅'

    // === 렌더링 시작 ===
    return (
        <div className="flex flex-col h-full">
            {/* Header: 채팅방 제목 및 뒤로가기 버튼 */}
            <div className="flex items-center p-md border-b border-border bg-surface">
                <button
                    onClick={() => navigate('/chat/my')} // 내 채팅 목록으로 이동
                    className="text-text-title mr-md"
                >
                    ←
                </button>
                <h2 className="text-heading-h2 text-text-title font-bold">
                    {opponentNickname} {/* 상대방 닉네임 표시 */}
                </h2>
            </div>

            {/* Messages: 메시지 목록 영역 (스크롤 가능) */}
            <div
                ref={scrollRef} // 스크롤 위치 제어를 위한 ref
                className="flex-1 overflow-y-auto px-4 py-3 bg-surface-muted"
            >
                {/* 이전 메시지 더 불러오기 버튼 (hasNext이 true일 때만 표시) */}
                {hasNext && (
                    <div className="text-center mb-4">
                        <button
                            onClick={loadMore} // 이전 메시지 로딩 함수 호출
                            disabled={loading} // 로딩 중일 때는 버튼 비활성화
                            className="px-4 py-2 bg-info/10 text-info rounded-full text-sm hover:bg-info/20 disabled:opacity-50 transition-colors"
                        >
                            {loading ? '로딩 중...' : '이전 메시지 보기'}
                        </button>
                    </div>
                )}
                {/* 전체 메시지 목록 렌더링 */}
                {allMessages.map((message, index) => {
                    const prevMessage = allMessages[index - 1]
                    // 프로필 표시 여부 결정: 이전 메시지가 없거나, 이전 메시지의 발신자와 현재 메시지의 발신자가 다를 경우에만 프로필/시간 표시
                    const showProfile = !prevMessage || prevMessage.senderId !== message.senderId

                    // 내 메시지 여부 결정
                    // 1. `mine` 플래그가 있으면 사용 (주로 WS 메시지)
                    // 2. 없으면 현재 사용자 ID와 메시지 발신자 ID 비교
                    const isMine =
                        message.mine !== undefined && currentUserId !== null
                            ? message.mine
                            : message.senderId === currentUserId

                    return (
                        <MessageItem
                            key={message.chatId} // 메시지 ID를 키로 사용
                            message={message}
                            isMine={isMine} // 내 메시지인지 여부
                            showProfile={showProfile} // 프로필 및 시간 표시 여부
                        />
                    )
                })}
            </div>

            {/* Input: 메시지 입력 및 전송 영역 */}
            <div className="flex items-center gap-2 p-3 bg-surface border-t border-border">
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)} // 입력값 업데이트
                    onKeyPress={handleKeyPress} // Enter 키 처리
                    placeholder="메시지를 입력하세요."
                    className="flex-1 px-4 py-2.5 bg-surface-muted rounded-full text-sm text-text-title placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                    onClick={handleSendMessage} // 전송 버튼 클릭 핸들러
                    // 메시지 내용이 비어있거나 WebSocket이 연결되지 않았을 경우 비활성화
                    disabled={!messageInput.trim() || !connected}
                    className="p-2.5 bg-primary text-text-body rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    aria-label="메시지 전송"
                >
                    {/* 전송 아이콘 */}
                    <SendIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}