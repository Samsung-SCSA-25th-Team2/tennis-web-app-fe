import {type Age, type GameType, type Period} from '@shared/types'

export type SortType = 'latest' | 'loc5' | 'loc10' | 'loc15' | 'locInf'

export type StatusType = 'RECRUITING' | 'COMPLETED' | 'ALL'

export interface MatchListResult {
    matches: Array<MatchInfo>
    size: number
    hasNext: boolean
    cursor: number
}

export interface MatchInfo {
    matchId: number,
    hostId: number,
    startDateTime: Date,
    endDateTime: Date,
    gameType: GameType,
    courtId : number,
    period: Array<Period>,
    playerCountMen: number,
    playerCountWomen: number,
    ageRange: Array<Age>,
    fee: number,
    description: string,
    status: StatusType,
    createdAt: Date,
    updatedAt: Date,
}

export interface CourtInfo {
    courtId: number,
    thumbnail: string,
    latitude: number,
    longitude: number,
    address: string,
    name: string,
}
