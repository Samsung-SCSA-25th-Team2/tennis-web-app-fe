import type {HTMLAttributes} from "react"

import {useGetApi} from "@shared/hooks"
import {ImgLoader} from "@shared/components/atoms"

import {MatchCard} from "./MatchCard.tsx"
import type {MatchListResult, SortType} from "../common.ts"
import type {GameType} from "@shared/types"
import type {DateRange} from "react-day-picker"
import type {TimeRange} from "@shared/types/common.ts"

interface MatchListProps extends HTMLAttributes<HTMLDivElement> {
    gameType: GameType
    sortType: SortType
    dateRange: DateRange
    timeRange: TimeRange
    status: string
}


export function MatchList({
    gameType,
    sortType,
    dateRange,
    timeRange,
    status,
                   }:MatchListProps) {

    const key = `${gameType}-${sortType}-${dateRange}-${timeRange}-${status}`
    const apiStatus = localStorage.getItem(key)

    const {hasNext, cursor} = apiStatus ? JSON.parse(apiStatus) : {hasNext: false, cursor: null}

    // TODO: save data -> manage key-value???
    if (!hasNext) {
        return null
    }

    const toSortParam = (sortType: SortType) => {
        switch (sortType) {
            case "latest":
                return "latest"
            case "recommend":
                return "recommend"
            default:
                // TODO: add latitude and longitude
                return "distance"
        }
    }

    const distanceParams = (sortType: SortType) => {
        if (sortType === "latest") {
            return {}
        }

        let radius = undefined
        switch (sortType) {
            case "loc5":
                radius = 5
                break
            case "loc10":
                radius = 10
                break
            case "loc15":
                radius = 15
                break
            case "locInf":
                radius = 9999
                break
        }

        // TODO: add latitude and longitude
        return {
            latitude: 0,
            longitude: 0,
            radius: radius,
        }
    }

    const options = {
        params: {
            sort: toSortParam(sortType),
            startDate: dateRange.from?.toISOString().split("T")[0],
            endDate: dateRange.to?.toISOString().split("T")[0],
            startTime: timeRange.start,
            endTime: timeRange.end,
            gameType: gameType,
            status: status,
            cursor: cursor,

            ...distanceParams(sortType)
        }
    }

    const {data, loading, error} = useGetApi<MatchListResult>('/v1/matches', JSON.stringify(options))

    console.log(`matchSearch: ${data} ${loading} ${error}`)

    if (loading) {
        return <ImgLoader imgType={'loading'} imgSize={'full'}/>
    } else if (error) {
        console.eror(`Error at MatchList: ${error}`)
        return <ImgLoader imgType={'500_error'} imgSize={'full'}/>
    }

    if (data) {
        localStorage.setItem('matchSearch', JSON.stringify({cursor:data.cursor,hasNext:data.hasNext}))
    }

    return (
        <div className="flex flex-1 flex-col bg-blue-500">
            {
                data?.matches.map((item, index) => (
                    <MatchCard key={index} matchInfo={item}/>
                ))
            }

        </div>
    )
}
