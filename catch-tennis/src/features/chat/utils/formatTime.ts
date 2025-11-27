
/**
 * 주어진 timestamp를 '오전/오후 X:YY' 형식으로 포맷합니다.
 * UTC 시간을 한국 시간(UTC+9)으로 변환하여 표시합니다.
 * @param timestamp - ISO 문자열 또는 Unix timestamp 숫자
 * @returns 포맷된 시간 문자열 (예: '오전 10:30')
 */
export function formatTime(timestamp: string | number | undefined): string {
    if (!timestamp) return ''

    try {
        // Date 생성자는 문자열과 숫자를 모두 처리합니다.
        const date = new Date(timestamp)

        if (isNaN(date.getTime())) {
            console.warn('Invalid date:', timestamp)
            return ''
        }

        // UTC 시간을 한국 시간(UTC+9)으로 변환하여 표시
        return date.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Seoul'
        })
    } catch (error) {
        console.error('Error formatting time:', error, timestamp)
        return ''
    }
}