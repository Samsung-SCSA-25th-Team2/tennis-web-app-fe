import {useState, useEffect, useCallback} from 'react'
import {useParams, useNavigate} from 'react-router-dom'

import AirplaneIcon from '@/assets/icons/Airplane.svg?react'

import type {ChatMessage} from '../common'
import type {ChatWebSocketMessage} from '../services/websocket'
import {MessageItem} from '../components/MessageItem'
import {useChatMessages} from '../hooks/useChatMessages'
import {useWebSocket} from '../hooks/useWebSocket'

export function ChatRoom() {
    const {roomId} = useParams<{roomId: string}>()
    const navigate = useNavigate()
    const [messageInput, setMessageInput] = useState('')
    const [currentUserId, setCurrentUserId] = useState<number | null>(null)
    const [allMessages, setAllMessages] = useState<ChatMessage[]>([])

    const roomIdNumber = roomId ? parseInt(roomId, 10) : 0

    const {
        messages,
        loading,
        error,
        hasNext,
        loadMore,
        scrollRef,
        scrollToBottom
    } = useChatMessages(roomIdNumber)

    // WebSocket connection
    const handleMessageReceived = useCallback((wsMessage: ChatWebSocketMessage) => {
        // Convert WebSocket message to ChatMessage format
        const newMessage: ChatMessage = {
            chatId: wsMessage.chatId,
            messageId: wsMessage.chatId, // Use chatId as messageId
            chatRoomId: wsMessage.chatRoomId,
            senderId: wsMessage.senderId,
            senderNickname: wsMessage.senderNickname,
            message: wsMessage.message,
            createdAt: wsMessage.createdAt,
            isRead: wsMessage.isRead,
            readAt: wsMessage.readAt
        }

        setAllMessages(prev => [...prev, newMessage])

        // Auto scroll to bottom when new message arrives
        setTimeout(() => scrollToBottom(), 100)
    }, [scrollToBottom])

    const {connected, error: wsError, sendMessage} = useWebSocket(
        roomIdNumber,
        handleMessageReceived
    )

    // Sync REST API messages with local state
    useEffect(() => {
        setAllMessages(messages)
    }, [messages])

    useEffect(() => {
        // Get current user ID from JWT token
        const token = localStorage.getItem('accessToken')
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]))
                const userId = parseInt(payload.sub)
                setCurrentUserId(userId)
            } catch (error) {
                console.error('Failed to parse JWT token:', error)
            }
        }
    }, [])

    if (!roomId || isNaN(roomIdNumber)) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-text-muted">잘못된 채팅방입니다.</p>
            </div>
        )
    }

    const handleSendMessage = () => {
        if (messageInput.trim() && connected) {
            try {
                sendMessage(messageInput.trim())
                setMessageInput('')
            } catch (error) {
                console.error('Failed to send message:', error)
                alert('메시지 전송에 실패했습니다.')
            }
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    if (loading && messages.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-text-muted">메시지를 불러오는 중...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-text-muted">메시지를 불러오는데 실패했습니다.</p>
            </div>
        )
    }

    // Get opponent nickname from messages
    const opponentNickname = allMessages.find(msg => msg.senderId !== currentUserId)?.senderNickname || '채팅'

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center p-md border-b border-border bg-surface">
                <button
                    onClick={() => navigate('/chat/my')}
                    className="text-text-title mr-md"
                >
                    ←
                </button>
                <h2 className="text-heading-h2 text-text-title font-bold">
                    {opponentNickname}
                </h2>
                {!connected && !wsError && (
                    <span className="ml-auto text-body-sm text-text-muted">
                        연결 중...
                    </span>
                )}
                {wsError && (
                    <span className="ml-auto text-body-sm text-yellow-600">
                        실시간 채팅 비활성
                    </span>
                )}
                {connected && (
                    <span className="ml-auto text-body-sm text-green-600">
                        ●
                    </span>
                )}
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-3 bg-surface-muted"
            >
                {hasNext && (
                    <div className="text-center mb-4">
                        <button
                            onClick={loadMore}
                            disabled={loading}
                            className="px-4 py-2 bg-info/10 text-info rounded-full text-sm hover:bg-info/20 disabled:opacity-50 transition-colors"
                        >
                            {loading ? '로딩 중...' : '이전 메시지 보기'}
                        </button>
                    </div>
                )}
                {allMessages.map((message, index) => {
                    // 같은 발신자의 연속된 메시지는 프로필 숨김
                    const prevMessage = allMessages[index - 1]
                    const showProfile = !prevMessage || prevMessage.senderId !== message.senderId

                    return (
                        <MessageItem
                            key={message.chatId || message.messageId || index}
                            message={message}
                            isMine={message.senderId === currentUserId}
                            showProfile={showProfile}
                        />
                    )
                })}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-3 bg-surface border-t border-border">
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="메시지를 입력하세요."
                    className="flex-1 px-4 py-2.5 bg-surface-muted rounded-full text-sm text-text-title placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || !connected}
                    className="p-2.5 bg-primary text-text-body rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <AirplaneIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}
