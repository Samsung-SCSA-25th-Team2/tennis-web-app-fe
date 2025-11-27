/**
 * 두 날짜가 같은 날인지 확인합니다.
 * 한국 시간(UTC+9) 기준으로 비교합니다.
 * @param date1 비교할 첫 번째 날짜
 * @param date2 비교할 두 번째 날짜
 * @returns 같은 날이면 true, 아니면 false
 */
export function isSameDay(date1: Date, date2: Date): boolean {
    // 한국 시간으로 변환하여 비교
    const koreaDate1 = new Date(date1.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
    const koreaDate2 = new Date(date2.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))

    return (
        koreaDate1.getFullYear() === koreaDate2.getFullYear() &&
        koreaDate1.getMonth() === koreaDate2.getMonth() &&
        koreaDate1.getDate() === koreaDate2.getDate()
    )
}

/**
 * 날짜를 카카오톡 스타일로 포맷팅합니다.
 * UTC 시간을 한국 시간(UTC+9)으로 변환하여 표시합니다.
 * @param timestamp ISO 문자열 또는 Unix timestamp 숫자
 * @returns 포맷된 날짜 문자열 (예: '2025년 1월 26일 수요일')
 */
export function formatDateDivider(timestamp: string | number | undefined): string {
    if (!timestamp) return ''

    try {
        const date = new Date(timestamp)
        if (isNaN(date.getTime())) {
            console.warn('Invalid date:', timestamp)
            return ''
        }

        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        // 오늘이면
        if (isSameDay(date, today)) {
            return '오늘'
        }

        // 어제면
        if (isSameDay(date, yesterday)) {
            return '어제'
        }

        // 그 외에는 'YYYY년 M월 D일 요일' 형식 (한국 시간 기준)
        const koreaDateString = date.toLocaleString('ko-KR', {
            timeZone: 'Asia/Seoul',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            weekday: 'long'
        })

        // '2025. 1. 26. 수요일' 형식을 '2025년 1월 26일 수요일' 형식으로 변환
        const parts = koreaDateString.match(/(\d+)\.\s*(\d+)\.\s*(\d+)\.\s*(.+)/)
        if (parts) {
            const [, year, month, day, weekday] = parts
            return `${year}년 ${month}월 ${day}일 ${weekday}`
        }

        return koreaDateString
    } catch (error) {
        console.error('Error formatting date:', error, timestamp)
        return ''
    }
}
