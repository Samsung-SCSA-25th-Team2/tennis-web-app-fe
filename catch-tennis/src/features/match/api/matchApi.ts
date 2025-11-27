import type {DateRange} from "react-day-picker"

import {api} from '@shared/api'
import {type TimeRange, GameType, Period, Age} from "@shared/types"
import type {CourtInfo, CourtListResult, MatchInfo} from "@features/match/common.ts"

import type {MatchListResult, SortType, StatusType} from "../common"
import {toISOStringKR} from "@shared/utils/datetimeFormatter.ts"

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

    let apiParams: Record<string, string | number | boolean | undefined> = {
        sort: sort,
        startDate: dateRange.from ? toISOStringKR(dateRange.from).split("T")[0] : undefined,
        endDate: dateRange.to ? toISOStringKR(dateRange.to).split("T")[0] : undefined,
        startTime: timeRange.start,
        endTime: timeRange.end,
        status: statusType,
        size: 10,
        ...(cursor && {cursor}),
        ...distanceParams

    }

    if (gameType !== GameType.ALL) {
        apiParams = {
            ...apiParams,
            gameType: gameType,
        }
    }

    return api.get<MatchListResult>('/v1/matches', {
        params: apiParams,
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