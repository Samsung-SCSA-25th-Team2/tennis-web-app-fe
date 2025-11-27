import type {DateRange} from "react-day-picker"

import {api} from '@shared/api'
import type {TimeRange, GameType, Period, Age} from "@shared/types"
import type {CourtInfo, CourtListResult, MatchInfo} from "@features/match/common.ts"

import type {MatchListResult, SortType, StatusType} from "../common"

export async function getMatchInfo(matchId: number | string) {
    return api.get<MatchInfo>(
        '/v1/matches/' + matchId,
        {useJWT:true}
    )
}

export async function getCourtInfo(courtId: number | string) {
    return api.get<CourtInfo>(
        '/v1/tennis-courts/' + courtId,
        {useJWT:true}
    )
}

export interface SearchMatchParams {
    gameType: GameType
    sortType: SortType
    statusType: StatusType
    dateRange: DateRange
    timeRange: TimeRange
    cursor?: string | null
}

export async function searchMatches(params: SearchMatchParams): Promise<MatchListResult> {
    const {gameType, sortType, statusType, dateRange, timeRange, cursor} = params

    let sort: SortType | string = sortType
    const distanceParams: Record<string, number> = {}

    if (sortType !== 'latest' && sortType !== 'recommend') {
        sort = 'distance'
        distanceParams.latitude = 0  // TODO: Get from user location
        distanceParams.longitude = 0

        if (sortType === 'loc5') distanceParams.radius = 5
        else if (sortType === 'loc10') distanceParams.radius = 10
        else if (sortType === 'loc15') distanceParams.radius = 15
        else distanceParams.radius = 9999
    }

    return api.get<MatchListResult>('/v1/matches', {
        params: {
            sort: sort,
            startDate: dateRange.from?.toISOString().split("T")[0],
            endDate: dateRange.to?.toISOString().split("T")[0],
            startTime: timeRange.start,
            endTime: timeRange.end,
            gameType: gameType,
            status: statusType,
            size: 10,
            ...(cursor && {cursor}),
            ...distanceParams
        },
        useJWT: true
    })
}

export interface SearchCourtParams {
    keyword: string
    cursor?: string | null
}

export async function searchCourts(params: SearchCourtParams): Promise<CourtListResult> {
    const {keyword, cursor} = params

    return api.get<CourtListResult>('/v1/tennis-courts/search', {
        params: {
            keyword,
            size: 10,
            ...(cursor && {cursor}),
        },
        useJWT: true
    })
}

export interface MatchCreateBody {
    startDateTime: string,
    endDateTime: string,
    gameType: GameType,
    courtId: number,
    period: Array<Period>,
    playerCountMen: number,
    playerCountWomen: number,
    ageRange: Array<Age>,
    fee: number,
    description: string,
}

export interface MatchCreateResult {
    matchId: number
    message: string
}

export async function matchCreatePost(body: MatchCreateBody): Promise<MatchCreateResult> {
    return api.post<MatchCreateResult>(
        '/v1/me/matches',
        body,
        {
            useJWT:true,
        })
}

export interface ChatCreateBody {
    matchId: number
}

export interface ChatCreateResult {
    chatRoomId: string
    matchId: string
    hostId: string
    hostNickname: string
    hostImgUrl: string
    guestId: string
    guestNickname: string
    guestImgUrl: string
}

export async function chatCreatePost(body: ChatCreateBody): Promise<ChatCreateResult> {
    return api.post<ChatCreateResult>(
        '/v1/chat/rooms',
        body,
        {useJWT:true}
    )
}

export interface ToggleMatchStatusResult {
    matchId: number;
    message: string;
}

/**
 * 매치 상태를 토글합니다 (모집중 ↔ 종료됨)
 * @param matchId 매치 ID
 */
export async function toggleMatchStatus(matchId: number): Promise<ToggleMatchStatusResult> {
    return api.patch(`/v1/me/matches/${matchId}`, {}, {
        useJWT: true,
    })
}

/**
 * 매치를 삭제합니다.
 * @param matchId 매치 ID
 */
export async function deleteMatch(matchId: number): Promise<string> {
    return api.delete(`/v1/me/matches/${matchId}`, {
        useJWT: true,
    })
}
