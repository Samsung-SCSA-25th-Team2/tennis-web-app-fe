import {useNavigate} from 'react-router-dom'
import {ChatRoomItem} from '../components/ChatRoomItem'
import {useChatRooms} from '../hooks/useChatRooms'
import {Button} from '@shared/components/atoms'

export function Chat() {
    const navigate = useNavigate()
    const {rooms, loading, error, hasNext, loadMore} = useChatRooms()

    const handleRoomClick = (roomId: number) => {
        navigate(`/chat/${roomId}`)
    }

    if (loading && rooms.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-text-muted">채팅방 목록을 불러오는 중...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-text-muted">채팅방 목록을 불러오는데 실패했습니다.</p>
            </div>
        )
    }

    if (rooms.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-text-muted">채팅방이 없습니다.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
                {rooms.map((room) => (
                    <ChatRoomItem
                        key={room.chatRoomId}
                        room={room}
                        onClick={handleRoomClick}
                    />
                ))}
            </div>
            {hasNext && (
                <div className="p-md border-t border-border">
                    <Button
                        variant="info"
                        buttonSize="full"
                        onClick={loadMore}
                        disabled={loading}
                    >
                        {loading ? '로딩 중...' : '더 보기'}
                    </Button>
                </div>
            )}
        </div>
    )
}
