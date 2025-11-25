import type {ChatMessage} from '../common'

interface MessageItemProps {
    message: ChatMessage;
    isMine: boolean;
    showProfile?: boolean;
}

export function MessageItem({message, isMine, showProfile = true}: MessageItemProps) {
    const formatTime = (timestamp: string | number) => {
        if (!timestamp) return ''

        try {
            // Handle both ISO string and timestamp number
            const date = typeof timestamp === 'number'
                ? new Date(timestamp)
                : new Date(timestamp)

            if (isNaN(date.getTime())) {
                console.warn('Invalid date:', timestamp)
                return ''
            }

            return date.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })
        } catch (error) {
            console.error('Error formatting time:', error, timestamp)
            return ''
        }
    }

    return (
        <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-2`}>
            {/* 카카오톡 스타일: 상대방 메시지는 왼쪽, 내 메시지는 오른쪽 */}
            <div className={`flex ${isMine ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[75%]`}>
                {/* 상대방 메시지일 때만 프로필 표시 */}
                {!isMine && (
                    <div className={`w-10 h-10 rounded-full bg-info/20 flex-shrink-0 flex items-center justify-center ${!showProfile ? 'invisible' : ''}`}>
                        <span className="text-info text-sm font-bold">
                            {message.senderNickname?.charAt(0) || '?'}
                        </span>
                    </div>
                )}

                <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    {/* 상대방 닉네임 */}
                    {!isMine && showProfile && (
                        <span className="text-xs text-text-title mb-1 px-1">
                            {message.senderNickname}
                        </span>
                    )}

                    <div className={`flex ${isMine ? 'flex-row-reverse' : 'flex-row'} items-end gap-1.5`}>
                        {/* 메시지 버블 */}
                        <div
                            className={`rounded-2xl px-3 py-2 shadow-sm ${
                                isMine
                                    ? 'bg-primary text-text-body'
                                    : 'bg-surface text-text-title border border-border'
                            }`}
                        >
                            <p className="text-sm break-words whitespace-pre-wrap leading-snug">
                                {message.content || message.message || ''}
                            </p>
                        </div>

                        {/* 시간 표시 */}
                        <span className="text-xs text-text-muted whitespace-nowrap pb-1">
                            {formatTime(message.createdAt || message.sentAt || '')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
