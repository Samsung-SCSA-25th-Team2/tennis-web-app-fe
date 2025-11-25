import {useState, useEffect, useCallback} from 'react'
import {getMyChatRooms} from '../api/chatApi'
import type {ChatRoomInfo} from '../common'

export function useChatRooms() {
    const [rooms, setRooms] = useState<ChatRoomInfo[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [nextCursor, setNextCursor] = useState<string | null>(null)
    const [hasNext, setHasNext] = useState(false)

    const fetchRooms = useCallback(async (cursor?: string) => {
        try {
            setLoading(true)
            setError(null)
            const response = await getMyChatRooms(cursor)

            if (cursor) {
                // Load more
                setRooms(prev => [...prev, ...response.rooms])
            } else {
                // Initial load
                setRooms(response.rooms)
            }

            setNextCursor(response.nextCursor)
            setHasNext(response.hasNext)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch chat rooms'))
        } finally {
            setLoading(false)
        }
    }, [])

    const loadMore = useCallback(() => {
        if (hasNext && nextCursor && !loading) {
            fetchRooms(nextCursor)
        }
    }, [hasNext, nextCursor, loading, fetchRooms])

    const refresh = useCallback(() => {
        fetchRooms()
    }, [fetchRooms])

    useEffect(() => {
        fetchRooms()
    }, [fetchRooms])

    return {
        rooms,
        loading,
        error,
        hasNext,
        loadMore,
        refresh
    }
}
