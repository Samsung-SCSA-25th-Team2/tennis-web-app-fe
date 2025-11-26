import {useState, useCallback, useEffect} from "react"

import type {CourtInfo} from "@features/match/common.ts"
import {searchCourts} from "@features/match/api/matchApi.ts"


export function useInfiniteCourtList(keyword: string) {
    const [courts, setCourts] = useState<CourtInfo[]>([])
    const [cursor, setCursor] = useState<string | null>(null)
    const [hasNext, setHasNext] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState(false)


    const fetchCourts = async (isLoadingMore: boolean) => {
        try {
            if (isLoadingMore) {
                setLoadingMore(true)
            } else {
                setLoading(true)
            }

            const result = await searchCourts({
                keyword,
                cursor: isLoadingMore ? cursor : null
            })

            const newCourts = isLoadingMore ? [...courts, ...result.courts] : result.courts

            setCourts(newCourts)
            setCursor(result.cursor)
            setHasNext(result.hasNext)

        } catch (err) {
            console.error(`Error at useInfiniteCourtList: ${err}`)
            setError(true)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    const doLoadMore = useCallback(() => {
        if (hasNext && !loading && !loadingMore) {
            fetchCourts(true)
        }
    }, [hasNext, loading, loadingMore, cursor])

    useEffect(() => {
        // Reset state
        setCourts([])
        setCursor(null)
        setHasNext(false)
        setError(false)

        fetchCourts(false)
    }, [keyword])

    return {
        courts,
        loading,
        loadingMore,
        error,
        hasNext,
        doLoadMore,
        isEmpty: !loading && courts.length === 0
    }

}