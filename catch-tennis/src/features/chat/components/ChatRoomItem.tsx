import {ImgLoader} from '@shared/components/atoms'
import type {ChatRoomInfo} from '../common'

interface ChatRoomItemProps {
    room: ChatRoomInfo;
    onClick: (roomId: number) => void;
}

export function ChatRoomItem({room, onClick}: ChatRoomItemProps) {
    const formatTime = (timestamp: string) => {
        if (!timestamp) return ''

        try {
            const date = new Date(timestamp)
            if (isNaN(date.getTime())) return ''

            const now = new Date()
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
            const diffTime = today.getTime() - messageDate.getTime()
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

            if (diffDays === 0) {
                // 오늘: 시간 표시 (오전/오후 12:34)
                return date.toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })
            } else if (diffDays === 1) {
                // 어제
                return '어제'
            } else if (diffDays < 7) {
                // 일주일 이내: N일 전
                return `${diffDays}일 전`
            } else {
                // 일주일 이상: 월/일
                return date.toLocaleDateString('ko-KR', {month: 'numeric', day: 'numeric'})
            }
        } catch (error) {
            console.error('Error formatting time:', error)
            return ''
        }
    }

    return (
        <div
            onClick={() => onClick(room.chatRoomId)}
            className="flex items-center gap-md p-md border-b border-border cursor-pointer hover:bg-surface-muted"
        >
            <ImgLoader
                imgType={'unknown'}
                unknownSrc={room.opponentImgUrl}
                unknownAlt={room.opponentNickname}
                className="w-12 h-12 rounded-full"
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-xs">
                    <h3 className="text-heading-h3 text-text-title font-bold">
                        {room.opponentNickname}
                    </h3>
                    <span className="text-body-sm text-text-muted">
                        {formatTime(room.lastMessageAt)}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-sm">
                    <p className="text-body-md text-text-muted truncate flex-1">
                        {room.lastMessagePreview || '메시지가 없습니다'}
                    </p>
                    {room.unreadCount > 0 && (
                        <span className="flex-shrink-0 bg-primary text-text-body text-body-sm rounded-full px-2 py-0.5 min-w-[20px] text-center font-medium">
                            {room.unreadCount > 99 ? '99+' : room.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
