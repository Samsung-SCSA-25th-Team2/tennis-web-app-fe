import {type HTMLAttributes, useEffect, useRef} from "react"
import type {DateRange} from "react-day-picker"

import {ImgLoader} from "@shared/components/atoms"
import type {TimeRange, GameType} from "@shared/types"
import {useInfiniteMatchList} from "@features/match/hook/usesInfiniteMatchList.ts"

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
        <div className="flex flex-1 flex-col gap-sm">
            {matches.map((match, i) => {
                return <MatchCard key={i} matchInfo={match}/>
            })}

            {loadingMore && <span className='text-caption'>로딩중...</span> }
            {hasNext && <div ref={sentinelRef} className='h-1'/>}
            {!hasNext && matches.length > 0 && (
                <span className='text-caption'>모든 매치를 조회했습니다.</span>
            )}
        </div>
    )
}
