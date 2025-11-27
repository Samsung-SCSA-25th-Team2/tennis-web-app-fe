import {api} from '@shared/api'
import type {MatchInfo} from '@features/match/common'

// 백엔드 API의 실제 응답을 위한 인터페이스
interface MyMatchesApiResponse {
    matches: MatchInfo[]
    cursor: number | null
    hasNext: boolean
    size: number
}

// 프론트엔드 컴포넌트가 사용하는 데이터 구조
export interface MyMatchesResponse {
    matches: MatchInfo[]
    nextCursor: string | null
    hasNext: boolean
}

/**
 * 내가 만든 매치 목록 조회
 * @param cursor 페이지네이션 커서 (문자열 형태)
 * @param size 페이지 크기 (기본값: 10)
 */
export async function getMyMatches(cursor?: string, size: number = 10): Promise<MyMatchesResponse> {
    // API는 숫자 형태의 cursor를 기대하므로 변환합니다.
    const params: { size: number; cursor?: number } = { size };
    if (cursor) {
        params.cursor = parseInt(cursor, 10);
    }

    // 실제 API 응답 인터페이스를 사용하여 데이터를 받습니다.
    const response = await api.get<MyMatchesApiResponse>('/v1/me/matches', {
        params,
        useJWT: true
    })

    // 받은 데이터를 프론트엔드 컴포넌트가 기대하는 형태로 변환하여 반환합니다.
    return {
        matches: response.matches,
        nextCursor: response.cursor !== null ? String(response.cursor) : null,
        hasNext: response.hasNext,
    }
}
