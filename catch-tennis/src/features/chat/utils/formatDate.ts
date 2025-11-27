/**
 * 두 날짜가 같은 날인지 확인합니다.
 * 백엔드에서 한국 시간(KST)을 직접 보내므로 별도의 시간대 변환 없이 비교합니다.
 * @param date1 비교할 첫 번째 날짜
 * @param date2 비교할 두 번째 날짜
 * @returns 같은 날이면 true, 아니면 false
 */
export function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    )
}

/**
 * 날짜를 카카오톡 스타일로 포맷팅합니다.
 * 백엔드에서 한국 시간(KST)을 직접 보내므로 별도의 시간대 변환 없이 사용합니다.
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
        today.setHours(0, 0, 0, 0)

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

        // 그 외에는 'YYYY년 M월 D일 요일' 형식
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
        const weekday = weekdays[date.getDay()]

        return `${year}년 ${month}월 ${day}일 ${weekday}`
    } catch (error) {
        console.error('Error formatting date:', error, timestamp)
        return ''
    }
}
