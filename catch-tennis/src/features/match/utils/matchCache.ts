import type {MatchInfo} from "../common"

export interface CachedData {
    matches: MatchInfo[]
    cursor: string | null
    hasNext: boolean
}

export function loadFromCache(key: string): CachedData | null {
    try {
        const cached = localStorage.getItem(key)
        return cached ? JSON.parse(cached) : null
    } catch (e) {
        console.error('Cache load failed:', e)
        return null
    }
}

export function saveToCache(key: string, data: CachedData): void {
    try {
        localStorage.setItem(key, JSON.stringify(data))
    } catch (e) {
        console.error('Cache save failed:', e)
    }
}

export function generateCacheKey(params: {
    gameType: string
    sortType: string
    statusType: string
    startDate: string
    endDate: string
    startTime: number
    endTime: number
}): string {
    const {gameType, sortType, statusType, startDate, endDate, startTime, endTime} = params
    return `matches:${gameType}:${sortType}:${statusType}:${startDate}:${endDate}:${startTime}:${endTime}`
}