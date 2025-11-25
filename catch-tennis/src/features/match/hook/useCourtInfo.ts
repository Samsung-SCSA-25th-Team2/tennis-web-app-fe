import {useEffect, useState} from "react"
import type {CourtInfo} from "@features/match/common.ts"
import {getCourtInfo} from "@features/match/api/matchApi.ts"

export function useCourtInfo(courtId: number | string | undefined) {
    const [courtInfo, setCourtInfo] = useState<CourtInfo | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (courtId === undefined) {
            return
        }

        getCourtInfo(courtId)
            .then((courtInfo: CourtInfo) => {
                setCourtInfo(courtInfo)
            })
            .catch((error) => {setError(error.message)})
            .finally(() => setIsLoading(false))
    }, [courtId])

    return { courtInfo, isLoading, error }
}
