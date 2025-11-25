import {useState, useEffect, useCallback, useRef} from 'react'
import {getChatMessages, markChatRoomAsRead} from '../api/chatApi'
import type {ChatMessage} from '../common'

export function useChatMessages(roomId: number) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [nextCursor, setNextCursor] = useState<string | null>(null)
    const [hasNext, setHasNext] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    const fetchMessages = useCallback(async (cursor?: string) => {
        try {
            setLoading(true)
            setError(null)
            const response = await getChatMessages(roomId, cursor)

            // Sort messages by timestamp (oldest first)
            const sortedMessages = [...response.messages].sort((a, b) => {
                const timeA = new Date(a.createdAt || a.sentAt || 0).getTime()
                const timeB = new Date(b.createdAt || b.sentAt || 0).getTime()
                return timeA - timeB
            })

            if (cursor) {
                // Load more (prepend older messages)
                setMessages(prev => [...sortedMessages, ...prev])
            } else {
                // Initial load
                setMessages(sortedMessages)
                // Mark as read when entering the chat room
                await markChatRoomAsRead(roomId)
            }

            setNextCursor(response.nextCursor)
            setHasNext(response.hasNext)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch messages'))
        } finally {
            setLoading(false)
        }
    }, [roomId])

    const loadMore = useCallback(() => {
        if (hasNext && nextCursor && !loading) {
            fetchMessages(nextCursor)
        }
    }, [hasNext, nextCursor, loading, fetchMessages])

    const refresh = useCallback(() => {
        fetchMessages()
    }, [fetchMessages])

    const scrollToBottom = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [])

    useEffect(() => {
        fetchMessages()
    }, [fetchMessages])

    useEffect(() => {
        // Scroll to bottom on initial load
        if (messages.length > 0 && !loading) {
            scrollToBottom()
        }
    }, [messages.length, loading, scrollToBottom])

    return {
        messages,
        loading,
        error,
        hasNext,
        loadMore,
        refresh,
        scrollRef,
        scrollToBottom
    }
}
