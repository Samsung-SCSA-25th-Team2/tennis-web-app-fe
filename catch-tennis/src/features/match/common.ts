import {type Age, type GameType, type Period} from '@shared/types'

export type SortType = 'latest' | 'loc5' | 'loc10' | 'loc15' | 'locInf' | 'recommend'

export type StatusType = 'RECRUITING' | 'COMPLETED' | 'RECRUITING,COMPLETED'

export interface MatchListResult {
    matches: Array<MatchInfo>
    size: number
    hasNext: boolean
    cursor: string
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

export interface CourtListResult {
    courts: Array<CourtInfo>
    size: number
    hasNext: boolean
    cursor: string
}

export interface CourtInfo {
    courtId: number,
    thumbnail: string,
    latitude: number,
    longitude: number,
    address: string,
    name: string,
}

export const getSortTypeLabel = (sortType: SortType) => {
    switch (sortType) {
        case "latest":
            return "최근순"
        case "recommend":
            return "추천순"
        case "loc5":
            return "거리순(<5km)"
        case "loc10":
            return "거리순(<10km)"
        case "loc15":
            return "거리순(<15km)"
        case "locInf":
            return "거리순"
    }
}

export const SORT_TYPE_OPTIONS: Array<{value: SortType, label: string}> = [
    'latest', 'loc5', 'loc10', 'loc15', 'locInf', 'recommend'
].map(value => (
    {
        value: value as SortType,
        label: getSortTypeLabel(value as SortType)
    }
))

export const getStatusTypeLabel = (statusType: StatusType) => {
    switch (statusType) {
        case "RECRUITING":
            return "모집중"
        case "COMPLETED":
            return "종료됨"
        case "RECRUITING,COMPLETED":
            return "모두"
    }
}

export const STATUS_TYPE_OPTIONS: Array<{value: StatusType, label: string}> = [
    'RECRUITING', 'COMPLETED', 'RECRUITING,COMPLETED'
].map(value => (
    {
        value: value as StatusType,
        label: getStatusTypeLabel(value as StatusType)
    }
))
