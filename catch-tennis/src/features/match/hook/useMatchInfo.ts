import {useEffect, useState} from "react"
import type {MatchInfo} from "@features/match/common.ts"
import {getMatchInfo} from "@features/match/api/matchApi.ts"

export function useMatchInfo(matchId: number | string | undefined) {
    const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (matchId === undefined) {
            return
        }

        getMatchInfo(matchId)
            .then((matchInfo: MatchInfo) => {
                setMatchInfo(matchInfo)
            })
            .catch((error) => {setError(error.message)})
            .finally(() => setIsLoading(false))
    }, [matchId])

    return { matchInfo, isLoading, error }
}
