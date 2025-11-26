interface DateDividerProps {
    date: string;
}

/**
 * 채팅방에서 날짜를 구분하는 구분선 컴포넌트 (카카오톡 스타일)
 */
export function DateDivider({date}: DateDividerProps) {
    return (
        <div className="flex items-center gap-3 my-4">
            {/* 왼쪽 선 */}
            <div className="flex-1 h-px bg-border"></div>

            {/* 날짜 텍스트 */}
            <span className="text-xs text-text-muted bg-background px-3 py-1 rounded-full border border-border">
                {date}
            </span>

            {/* 오른쪽 선 */}
            <div className="flex-1 h-px bg-border"></div>
        </div>
    )
}
