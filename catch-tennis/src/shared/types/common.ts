import type {Age, Gender, Period} from "@shared/types/enums.ts"

export interface UserStatus {
    authenticated: boolean
    userId: number
    provider: string
    providerId: string
    name: string
    imageUrl: string
    isProfileComplete: boolean
    message: string
    loginUrl: string
}

export interface ProfileData {
    userId: number;
    nickname: string;
    period: Period;
    gender: Gender;
    age: Age;
    imgUrl?: string;
    name: string;
}

export interface TimeRange {
    start: number
    end: number
}