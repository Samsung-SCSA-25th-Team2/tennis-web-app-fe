import type {Age, Gender, Period} from "@shared/types/enums.ts"

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888'

export const baseUrl: string = API_BASE_URL
export const loginUrl: string = API_BASE_URL + '/oauth2/authorization/kakao'
export const apiUrl: string = API_BASE_URL + '/api'

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