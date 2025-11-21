import type {MatchInfo} from "../../shared/types/matches.ts"

export type SortType = 'latest' | 'loc5' | 'loc10' | 'loc15' | 'locInf'

export type StatusType = 'RECRUITING' | 'COMPLETED' | 'ALL'

export interface MatchListResult {
    matches: Array<MatchInfo>
    size: number
    hasNext: boolean
    cursor: number
}
