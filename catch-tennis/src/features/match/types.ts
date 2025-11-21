import {GameType} from "../../shared/types/enums.ts"

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
    fee: number,
    status: StatusType,
    createdAt: Date,
    
}
