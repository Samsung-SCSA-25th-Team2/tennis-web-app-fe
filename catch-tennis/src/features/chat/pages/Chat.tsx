import {useNavigate} from 'react-router-dom'
import {ChatRoomItem} from '../components/ChatRoomItem'
import {useChatRooms} from '../hooks/useChatRooms' // 채팅방 목록 데이터 관리를 위한 커스텀 훅
import {Button, ImgLoader} from '@shared/components/atoms' // 공통 컴포넌트 임포트

/**
 * 전체 채팅방 목록을 표시하고 관리하는 페이지 컴포넌트입니다.
 */
export function Chat() {
    const navigate = useNavigate() // React Router를 사용하여 페이지 이동을 처리하는 훅
    // useChatRooms 훅을 사용하여 채팅방 목록 데이터와 상태를 가져옵니다.
    const {rooms, loading, error, hasNext, loadMore, refresh} = useChatRooms()

    /**
     * 특정 채팅방 항목 클릭 시 해당 채팅방으로 이동하는 핸들러입니다.
     * @param roomId 클릭된 채팅방의 ID
     */
    const handleRoomClick = (roomId: number) => {
        navigate(`/chat/${roomId}`) // /chat/{roomId} 경로로 이동
    }

    // --- 조건부 렌더링: 로딩, 에러, 빈 목록 상태 처리 ---

    // 1. 초기 로딩 상태: 채팅방 데이터가 아직 없고 로딩 중일 때 (최초 로딩)
    if (loading && rooms.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <ImgLoader imgType="loading" imgSize="large" /> {/* 큰 로딩 스피너 표시 */}
            </div>
        )
    }

    // 2. 에러 상태: 초기 로드 시 에러가 발생하여 채팅방 목록을 가져오지 못했을 때
    if (error && rooms.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4">
                    <p className="text-text-muted">채팅방 목록을 불러오는데 실패했습니다.</p>
                    <p className="text-sm text-text-caption">{error.message}</p>
                    <Button
                        variant="primary"
                        buttonSize="md"
                        onClick={refresh} // '다시 시도' 버튼 클릭 시 refresh 함수 호출
                        aria-label="채팅방 목록 다시 불러오기"
                    >
                        다시 시도
                    </Button>
                </div>
            </div>
        )
    }

    // 3. 빈 목록 상태: 로딩이 끝났는데 채팅방이 하나도 없을 때
    if (rooms.length === 0 && !loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-text-muted">채팅방이 없습니다.</p>
            </div>
        )
    }

    // --- 주 렌더링: 채팅방 목록 표시 ---

    return (
        <div className="flex flex-col h-full">
            {/* 채팅방 목록 영역: 세로 스크롤 가능 */}
            <div className="flex-1 overflow-y-auto">
                {/* rooms 배열을 순회하며 각 채팅방 항목(ChatRoomItem)을 렌더링합니다. */}
                {rooms.map((room) => (
                    <ChatRoomItem
                        key={room.chatRoomId} // 고유 키
                        room={room} // 채팅방 데이터 전달
                        onClick={handleRoomClick} // 클릭 핸들러 전달
                    />
                ))}

                {/* 추가 로딩 중 표시 (이미 채팅방이 로드된 상태에서 '더 보기'를 눌렀을 때) */}
                {loading && rooms.length > 0 && (
                    <div className="flex justify-center py-4">
                        <ImgLoader imgType="loading" imgSize="medium" /> {/* 중간 크기 로딩 스피너 표시 */}
                    </div>
                )}
            </div>

            {/* 더보기 버튼 영역 */}
            {/* 다음 페이지가 있고 (hasNext=true), 현재 로딩 중이 아닐 때만 버튼을 표시 */}
            {hasNext && !loading && (
                <div className="p-md border-t border-border">
                    <Button
                        variant="info"
                        buttonSize="full" // 너비 전체를 차지하는 버튼
                        onClick={loadMore} // 버튼 클릭 시 다음 페이지 로드
                        disabled={loading} // 로딩 중에는 버튼 비활성화
                        aria-label="채팅방 더 불러오기"
                    >
                        더 보기
                    </Button>
                </div>
            )}
        </div>
    )
}