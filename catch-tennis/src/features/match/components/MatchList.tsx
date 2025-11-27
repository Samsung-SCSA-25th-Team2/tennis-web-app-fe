import {type HTMLAttributes, useEffect, useRef} from "react"
import type {DateRange} from "react-day-picker"

import {ImgLoader, Spinner} from "@shared/components/atoms"
import type {TimeRange, GameType} from "@shared/types"
import {useInfiniteMatchList} from "@features/match/hook/useInfiniteMatchList.ts"

import {MatchCard} from "./MatchCard.tsx"
import type {SortType, StatusType} from "../common.ts"


interface MatchListProps extends HTMLAttributes<HTMLDivElement> {
    gameType: GameType
    sortType: SortType
    dateRange: DateRange
    timeRange: TimeRange
    statusType: StatusType
}

export function MatchList({
    gameType,
    sortType,
    dateRange,
    timeRange,
    statusType,
                   }:MatchListProps) {

    const {matches, loading, loadingMore, error, hasNext, doLoadMore, isEmpty} = useInfiniteMatchList({
        gameType,
        sortType,
        statusType,
        dateRange,
        timeRange
    })
    const sentinelRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasNext && !loading && !loadingMore) {
                    doLoadMore()
                }
            },
            {threshold: 0.1, rootMargin: '100px'}
        )

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current)
        }
        return (() => {observer.disconnect()})
    }, [hasNext, loading, loadingMore, doLoadMore])

    if (loading) {
        return <ImgLoader imgType={'loading'} imgSize={'full'}/>
    }
    if (error && matches.length === 0) {
        return <ImgLoader imgType={'500_error'} imgSize={'full'} />
    }
    if (isEmpty) {
        return <div className="text-caption">해당하는 매치가 없습니다.</div>
    }


    return (
        <div className="flex flex-1 flex-col overflow-y-auto min-h-0 gap-4 p-4">
            {matches.map((match, i) => {
                return <MatchCard key={i} matchInfo={match}/>
            })}

            {loadingMore && (
                <div className="flex justify-center items-center p-4">
                    <Spinner size="md" />
                </div>
            )}
            {hasNext && <div ref={sentinelRef} className='h-1'/>}
            {!hasNext && matches.length > 0 && (
                <div className="text-center py-4">
                    <span className='text-sm text-text-muted'>모든 매치를 조회했습니다.</span>
                </div>
            )}
        </div>
    )
}
