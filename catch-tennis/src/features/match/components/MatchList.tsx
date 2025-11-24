import type {HTMLAttributes} from "react"

import {useGetApi} from "@shared/hooks"
import {ImgLoader} from "@shared/components/atoms"

import {MatchCard} from "./MatchCard.tsx"
import type {MatchListResult} from "../common.ts"

interface MatchListProps extends HTMLAttributes<HTMLDivElement> {
    // TODO: use types
    gameType: string
    sortType: string
    startDatetime: Date
    endDatetime: Date
    status: string
}


export function MatchList({
    gameType,
    sortType,
    startDatetime,
    endDatetime,
    status,
                   }:MatchListProps) {

    console.log(`MatchList: ${gameType}, ${sortType}, ${startDatetime}, ${endDatetime}, ${status}`)
    // const size = 10
    // const cursor = 1
    // const latitude = 37.57
    // const longitude = 126.97
    // const radius = 999999999

    // const options = {
    //     params: {
    //         sort: sortType,
    //         date: startDatetime.toISOString().substring(0, 10),
    //         // startTime: startDatetime.getHours(),
    //         // endTime: endDatetime.getHours() > startDatetime.getHours() ? endDatetime.getHours() : 23,
    //         startTime: 0,
    //         endTime: 23,
    //         gameType,
    //         latitude,
    //         longitude,
    //         radius,
    //         status: status === 'ALL' ? 'RECRUITING,COMPLETED' : 'RECRUITING',
    //         size,
    //         cursor,
    //     }
    // }

    const options = {}

    const {data, loading, error} = useGetApi<MatchListResult>('/v1/matches', JSON.stringify(options))

    console.log(`${data} ${loading} ${error}`)

    if (loading) {
        return <ImgLoader imgType={'loading'} imgSize={'full'}/>
    } else if (error) {
        console.log(`Error at MatchList: ${error}`)
        return <ImgLoader imgType={'error'} imgSize={'full'}/>
    }

    // TODO: calculate the distances for each courts


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
