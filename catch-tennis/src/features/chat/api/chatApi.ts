import {api} from '@shared/api'
import type {
    ChatRoomListResponse,
    ChatMessageListResponse,
    CreateChatRoomRequest,
    CreateChatRoomResponse
} from '../common'

/**
 * Get my chat room list with cursor-based pagination
 */
export async function getMyChatRooms(cursor?: string, size: number = 20) {
    return api.get<ChatRoomListResponse>(
        '/v1/chat/rooms/my',
        {
            useJWT: true,
            params: {
                ...(cursor && {cursor}),
                size
            }
        }
    )
}

/**
 * Get messages in a chat room with cursor-based pagination
 */
export async function getChatMessages(roomId: number, cursor?: string, size: number = 20) {
    return api.get<ChatMessageListResponse>(
        `/v1/chat/rooms/${roomId}/messages`,
        {
            useJWT: true,
            params: {
                ...(cursor && {cursor}),
                size
            }
        }
    )
}

/**
 * Create a new 1:1 chat room
 */
export async function createChatRoom(request: CreateChatRoomRequest) {
    return api.post<CreateChatRoomResponse>(
        '/v1/chat/rooms',
        request,
        {useJWT: true}
    )
}

/**
 * Mark messages in a chat room as read
 */
export async function markChatRoomAsRead(chatRoomId: number) {
    return api.patch(
        `/v1/chat/rooms/${chatRoomId}/read`,
        undefined,
        {useJWT: true}
    )
}
