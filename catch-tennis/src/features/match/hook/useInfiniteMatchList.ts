import {useState, useCallback, useEffect} from "react"
import type {DateRange} from "react-day-picker"

import type {TimeRange, GameType} from "@shared/types"
import type {MatchInfo, SortType, StatusType} from "@features/match/common.ts"
import {generateCacheKey, loadFromCache, saveToCache} from "@features/match/utils/matchCache.ts"
import {searchMatches} from "@features/match/api/matchApi.ts"


interface Params {
    gameType: GameType
    sortType: SortType
    statusType: StatusType
    dateRange: DateRange
    timeRange: TimeRange
}

export function useInfiniteMatchList(params: Params) {
    const {gameType, sortType, statusType, dateRange, timeRange} = params

    const [matches, setMatches] = useState<MatchInfo[]>([])
    const [cursor, setCursor] = useState<string | null>(null)
    const [hasNext, setHasNext] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState(false)

    const cacheKey = generateCacheKey({
        gameType,
        sortType,
        statusType,
        startDate: dateRange.from ? dateRange.from.toDateString() : "",
        endDate: dateRange.to ? dateRange.to.toDateString() : "",
        startTime: timeRange.start,
        endTime: timeRange.end
    })

    const fetchMatches = async (isLoadingMore: boolean) => {
        try {
            if (isLoadingMore) {
                setLoadingMore(true)
            } else {
                setLoading(true)
            }

            const result = await searchMatches({
                ...params,
                cursor: isLoadingMore ? cursor : null
            })

            const newMatches = isLoadingMore ? [...matches, ...result.matches] : result.matches

            setMatches(newMatches)
            setCursor(result.cursor)
            setHasNext(result.hasNext)

            // Save to cache
            saveToCache(cacheKey, {
                matches: newMatches,
                cursor: result.cursor,
                hasNext: result.hasNext
            })

        } catch (err) {
            console.error(`Error at useInfiniteMatchList: ${err}`)
            setError(true)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    const doLoadMore = useCallback(() => {
        if (hasNext && !loading && !loadingMore) {
            fetchMatches(true)
        }
    }, [hasNext, loading, loadingMore, cursor])

    useEffect(() => {
        // Reset state
        setMatches([])
        setCursor(null)
        setHasNext(false)
        setError(false)

        // TODO: add use cache & add TTL
        const cached = loadFromCache(cacheKey)
        if (cached) {
            setMatches(cached.matches)
            setCursor(cached.cursor)
            setHasNext(cached.hasNext)
        }

        fetchMatches(false)
    }, [cacheKey])

    return {
        matches,
        loading,
        loadingMore,
        error,
        hasNext,
        doLoadMore,
        isEmpty: !loading && matches.length === 0
    }

}