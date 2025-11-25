import type {Gender, Age, GameType, Period} from "./enums.ts"


// Profile
export interface ProfileFormState {
    nickname: string
    gender: Gender | null
    period: Period | null
    age: Age | null
}

// Match
export interface DateTimeRange {
    startDateTime: string
    endDateTime: string
}

export interface PlayerCount {
    men: number
    women: number
}

export interface MatchFormState {
    courtId: number | null
    dateTime: DateTimeRange | null
    periodRange: Period[]
    gameType: GameType | null
    playerCount: PlayerCount
    ageRange: Age[]
    fee: number
    description: string
}
