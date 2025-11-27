/**
 * JWT 토큰 유틸리티 함수들
 */

/**
 * JWT 토큰이 만료되었는지 확인합니다.
 * @param token JWT 토큰 문자열
 * @returns 만료되었으면 true, 아니면 false
 */
export function isTokenExpired(token: string | null): boolean {
    if (!token) return true

    try {
        // JWT는 header.payload.signature 형식
        const payload = JSON.parse(atob(token.split('.')[1]))
        const exp = payload.exp * 1000 // 초 → 밀리초 변환

        // 현재 시간과 비교 (5초 여유를 둠)
        return Date.now() >= (exp - 5000)
    } catch (e) {
        console.error('Failed to parse JWT token:', e)
        return true
    }
}

/**
 * JWT 토큰에서 사용자 ID를 추출합니다.
 * @param token JWT 토큰 문자열
 * @returns 사용자 ID 또는 null
 */
export function getUserIdFromToken(token: string | null): number | null {
    if (!token) return null

    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return parseInt(payload.sub) // 'sub' 클레임에서 사용자 ID 추출
    } catch (e) {
        console.error('Failed to extract user ID from token:', e)
        return null
    }
}

/**
 * JWT 토큰의 만료 시간을 반환합니다.
 * @param token JWT 토큰 문자열
 * @returns 만료 시간 (Date 객체) 또는 null
 */
export function getTokenExpiration(token: string | null): Date | null {
    if (!token) return null

    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return new Date(payload.exp * 1000)
    } catch (e) {
        console.error('Failed to get token expiration:', e)
        return null
    }
}