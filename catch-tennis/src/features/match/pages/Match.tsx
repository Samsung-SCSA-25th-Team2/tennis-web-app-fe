import {useState} from "react"

import {GameType} from "@shared/types"

import {FilterBar} from "../components/FilterBar.tsx"
import {MatchList} from "../components/MatchList.tsx"
import {CreateMatchButton} from "../components/CreateMatchButton.tsx"
import type {SortType, StatusType} from "../common.ts"


export function Match() {
    const [gameType, setGameType] = useState<GameType>(GameType.MixedDoubles)
    const [sortType, setSortType] = useState<SortType>('latest')
    const [startDatetime, setStartDatetime] = useState<Date>(new Date(1763686800000))
    const [endDatetime, setEndDatetime] = useState<Date>(new Date(1793478550000))
    const [statusType, setStatusType] = useState<StatusType>('RECRUITING')

    console.log(`Match: ${setGameType} ${setSortType} ${setStartDatetime}, ${setEndDatetime}, ${setStatusType}`)

    return (
        <>
            <FilterBar />
            <MatchList
                gameType={gameType}
                sortType={sortType}
                startDatetime={startDatetime}
                endDatetime={endDatetime}
                status={statusType}
            />
            <CreateMatchButton />
        </>
    )
}
