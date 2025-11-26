import {useState, useEffect, useCallback, useRef} from 'react'
import {getChatMessages, markChatRoomAsRead} from '../api/chatApi'
import type {ChatMessage} from '../common'

/**
 * 특정 채팅방의 메시지를 관리하고, 불러오기, 페이지네이션, 읽음 처리, 스크롤링을 담당하는 커스텀 훅입니다.
 * @param roomId 현재 활성화된 채팅방의 ID
 */
export function useChatMessages(roomId: number) {
    // 채팅방 메시지 목록 상태. ChatMessage[] 타입의 배열입니다.
    const [messages, setMessages] = useState<ChatMessage[]>([])
    // 메시지 로딩 상태 (API 호출 중인지 여부)
    const [loading, setLoading] = useState(false)
    // 오류 발생 상태
    const [error, setError] = useState<Error | null>(null)
    // 다음 페이지를 불러오기 위한 커서 값 (페이지네이션에 사용)
    const [nextCursor, setNextCursor] = useState<string | null>(null)
    // 다음 페이지가 존재하는지 여부
    const [hasNext, setHasNext] = useState(false)
    // 메시지 목록을 표시하는 DOM 요소(예: div)에 접근하기 위한 ref
    const scrollRef = useRef<HTMLDivElement>(null)

    /**
     * 채팅 메시지를 API에서 비동기로 불러오는 함수입니다.
     * @param cursor 페이지네이션을 위한 커서 값 (null/undefined이면 초기 로드)
     */
    const fetchMessages = useCallback(async (cursor?: string) => {
        try {
            setLoading(true)
            setError(null)
            // API를 통해 메시지 데이터를 가져옵니다.
            const response = await getChatMessages(roomId, cursor)

            // 메시지를 createdAt 타임스탬프 기준으로 정렬합니다 (오래된 메시지가 먼저 오도록).
            const sortedMessages = [...response.messages].sort((a, b) => {
                const timeA = new Date(a.createdAt || 0).getTime()
                const timeB = new Date(b.createdAt || 0).getTime()
                return timeA - timeB
            })

            if (cursor) {
                // 커서가 있으면: 추가 로드 (기존 메시지 앞에 새 메시지(오래된 것)를 추가하여 Prepend)
                setMessages(prev => [...sortedMessages, ...prev])
            } else {
                // 커서가 없으면: 초기 로드
                setMessages(sortedMessages)
                // 초기 로드 시 채팅방을 '읽음'으로 표시하는 API를 호출합니다.
                await markChatRoomAsRead(roomId)
            }

            // 페이지네이션 정보를 업데이트합니다.
            setNextCursor(response.nextCursor)
            setHasNext(response.hasNext)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch messages'))
        } finally {
            setLoading(false)
        }
    }, [roomId]) // roomId가 변경될 때마다 함수 재생성

    /**
     * 다음 페이지의 메시지를 불러오는 함수입니다 (스크롤 상단 도달 시 사용).
     */
    const loadMore = useCallback(() => {
        // 다음 페이지가 있고, 커서가 존재하며, 현재 로딩 중이 아닐 때만 실행
        if (hasNext && nextCursor && !loading) {
            fetchMessages(nextCursor)
        }
    }, [hasNext, nextCursor, loading, fetchMessages])

    /**
     * 메시지 목록을 처음부터 새로고침하는 함수입니다.
     */
    const refresh = useCallback(() => {
        fetchMessages() // 커서 없이 호출하여 초기 로드를 수행합니다.
    }, [fetchMessages])

    /**
     * 메시지 목록을 가장 아래(최신 메시지)로 스크롤하는 함수입니다.
     */
    const scrollToBottom = useCallback(() => {
        if (scrollRef.current) {
            // 스크롤 가능한 높이의 최하단으로 이동
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [])

    // 컴포넌트 마운트 시 및 fetchMessages 함수가 변경될 때 (roomId 변경 시) 초기 메시지를 불러옵니다.
    useEffect(() => {
        fetchMessages()
    }, [fetchMessages])

    // 메시지 목록이 업데이트되거나 로딩 상태가 변경될 때 스크롤 처리를 수행합니다.
    useEffect(() => {
        // 메시지 로드가 완료된 후 (초기 로드 또는 새 메시지 수신 후) 가장 아래로 스크롤
        // 참고: 추가 메시지(loadMore) 로드 시에는 스크롤을 유지하기 위해 이 로직을 조정해야 할 수 있습니다.
        if (messages.length > 0 && !loading) {
            scrollToBottom()
        }
    }, [messages.length, loading, scrollToBottom])

    // 컴포넌트 외부에서 사용할 상태 및 함수를 반환합니다.
    return {
        messages, // 현재 채팅 메시지 목록
        loading, // 로딩 상태
        error, // 오류 상태
        hasNext, // 다음 페이지 존재 여부
        loadMore, // 추가 메시지 로드 함수
        refresh, // 메시지 새로고침 함수
        scrollRef, // 스크롤 요소에 연결할 ref
        scrollToBottom // 수동 스크롤 함수
    }
}