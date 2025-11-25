import type {Gender, Age, GameType, Period} from "./enums.ts"

// Profile
export interface ProfileCompleteRequest {
    nickname: string
    gender: Gender
    period: Period
    age: Age
}

// Match
export interface MatchCreateRequest {
    startDateTime: string
    endDateTime: string
    gameType: GameType
    courtId: number
    period: Period[]
    playerCountMen: number
    playerCountWomen: number
    ageRange: Age[]
    fee: number
    description: string
}