// Chat Room Types
export interface ChatRoomInfo {
    chatRoomId: number;
    matchId: number;
    opponentId: number;
    opponentNickname: string;
    opponentImgUrl: string;
    lastMessagePreview: string;
    lastMessageAt: string;
    unreadCount: number;
}

export interface ChatRoomListResponse {
    rooms: ChatRoomInfo[];
    nextCursor: string;
    hasNext: boolean;
}

// Chat Message Types
export interface ChatMessage {
    chatId: number;
    chatRoomId: number;
    senderId: number;
    senderNickname: string;
    senderImgUrl?: string;
    message: string;
    createdAt?: string;
    read?: boolean;
    readAt?: string;
    mine?: boolean;
}

export interface ChatMessageListResponse {
    messages: ChatMessage[];
    nextCursor: string;
    hasNext: boolean;
}

// Chat Room Creation
export interface CreateChatRoomRequest {
    matchId: number;
    guestId: number;
}

export interface CreateChatRoomResponse {
    chatRoomId: number;
    matchId: number;
    hostId: number;
    hostNickname: string;
    hostImgUrl: string;
    guestId: number;
    guestNickname: string;
    guestImgUrl: string;
}
