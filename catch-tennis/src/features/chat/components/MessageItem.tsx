import type {ChatMessage} from '../common'
import {formatTime} from '../utils/formatTime'

// MessageItem 컴포넌트의 props 타입을 정의합니다.
interface MessageItemProps {
    message: ChatMessage; // 표시할 메시지 데이터 객체
    isMine: boolean; // 현재 사용자의 메시지인지 여부 (true: 내 메시지, false: 상대방 메시지)
    showProfile?: boolean; // 상대방 메시지일 때 프로필을 표시할지 여부 (기본값: true)
}

// 메시지 항목을 렌더링하는 컴포넌트입니다.
export function MessageItem({message, isMine, showProfile = true}: MessageItemProps) {

    return (
        // 전체 메시지 컨테이너
        // isMine 값에 따라 'justify-end' (오른쪽 정렬, 내 메시지) 또는 'justify-start' (왼쪽 정렬, 상대방 메시지)를 적용합니다.
        <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-2`}>
            {/* 메시지 내용, 시간, 프로필을 포함하는 내부 컨테이너 */}
            {/* isMine 값에 따라 'flex-row-reverse' (오른쪽 정렬) 또는 'flex-row' (왼쪽 정렬)를 적용합니다. */}
            <div className={`flex ${isMine ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[75%]`}>
                {/* 상대방 메시지일 때만 프로필 표시 영역 */}
                {!isMine && (
                    <div
                        className={`w-10 h-10 rounded-full flex-shrink-0 overflow-hidden ${!showProfile ? 'invisible' : ''}`}>
                        {/* 프로필 이미지 URL이 있을 경우 이미지 표시 */}
                        {message.senderImgUrl ? (
                            <img
                                src={message.senderImgUrl}
                                alt={message.senderNickname}
                                className="w-full h-full object-cover"
                                // 이미지 로드 실패 시 대체(fallback) UI 처리
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.style.display = 'none' // 이미지를 숨김
                                    const parent = target.parentElement
                                    if (parent) {
                                        // 부모 div에 대체 배경 및 텍스트 스타일을 추가합니다.
                                        parent.classList.add('bg-info/20', 'flex', 'items-center', 'justify-center')
                                        // 닉네임의 첫 글자를 표시합니다.
                                        parent.innerHTML = `<span class="text-info text-sm font-bold">${message.senderNickname?.charAt(0) || '?'}</span>`
                                    }
                                }}
                            />
                        ) : (
                            // 프로필 이미지 URL이 없을 경우 닉네임의 첫 글자를 표시하는 대체 UI
                            <div className="w-full h-full bg-info/20 flex items-center justify-center">
                                <span className="text-info text-sm font-bold">
                                    {message.senderNickname?.charAt(0) || '?'}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* 닉네임, 메시지 버블, 시간을 포함하는 컨테이너 */}
                <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    {/* 상대방 닉네임 표시 (내 메시지가 아니고, 프로필 표시 옵션이 true일 때만) */}
                    {!isMine && showProfile && (
                        <span className="text-xs text-text-title mb-1 px-1">
                            {message.senderNickname}
                        </span>
                    )}

                    {/* 메시지 버블과 시간을 포함하는 행 */}
                    <div className={`flex ${isMine ? 'flex-row-reverse' : 'flex-row'} items-end gap-1.5`}>
                        {/* 메시지 버블 (말풍선) */}
                        <div
                            className={`rounded-2xl px-3 py-2 shadow-sm ${
                                // isMine에 따라 배경색 및 텍스트 색상을 다르게 적용합니다.
                                isMine
                                    ? 'bg-primary text-text-body' // 내 메시지: 주 색상 배경
                                    : 'bg-surface text-text-title border border-border' // 상대방 메시지: 밝은 배경, 테두리
                            }`}
                        >
                            {/* 메시지 텍스트 내용 */}
                            <p className="text-sm break-words whitespace-pre-wrap leading-snug">
                                {message.message}
                            </p>
                        </div>

                        {/* 시간 표시 */}
                        {/* formatTime 유틸 함수를 사용하여 시간을 포맷팅합니다. */}
                        <span className="text-xs text-text-muted whitespace-nowrap pb-1">
                            {formatTime(message.createdAt || '')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}