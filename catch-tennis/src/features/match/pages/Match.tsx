import {useState} from "react"

import {GameType} from "@shared/types"

import {FilterBar} from "../components/FilterBar.tsx"
import {MatchList} from "../components/MatchList.tsx"
import type {SortType, StatusType} from "../common.ts"
import type {TimeRange} from "@shared/types/common.ts"
import type {DateRange} from "react-day-picker"


export function Match() {
    const [gameType, setGameType] = useState<GameType>(GameType.MixedDoubles)
    const [sortType, setSortType] = useState<SortType>('latest')
    const [statusType, setStatusType] = useState<StatusType>('RECRUITING')

    const [dateRange, setDateRange] = useState<DateRange>({from: new Date(), to: new Date()})
    const [timeRange, setTimeRange] = useState<TimeRange>({start:0,end:24})

    return (
        <>
            <FilterBar
                gameType={gameType}
                onGameTypeChange={setGameType}
                sortType={sortType}
                onSortTypeChange={setSortType}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
                status={statusType}
                onStatusChange={setStatusType}
            />
            <MatchList
                gameType={gameType}
                sortType={sortType}
                dateRange={dateRange}
                timeRange={timeRange}
                status={statusType}
            />
        </>
    )
}
