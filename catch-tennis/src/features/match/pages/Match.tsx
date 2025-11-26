import { useSearchParams } from "react-router-dom"
import type { DateRange } from "react-day-picker"

import { GameType } from "@shared/types"
import type { TimeRange } from "@shared/types/common.ts"

import { FilterBar } from "../components/FilterBar.tsx"
import { MatchList } from "../components/MatchList.tsx"
import type { SortType, StatusType } from "../common.ts"


export function Match() {
    const [searchParams, setSearchParams] = useSearchParams()

    const gameType = (searchParams.get("gameType") as GameType) || GameType.Singles
    const sortType = (searchParams.get("sortType") as SortType) || "latest"
    const statusType = (searchParams.get("statusType") as StatusType) || "RECRUITING"

    const dateRange: DateRange = {
        from: searchParams.get("from") ? new Date(searchParams.get("from")!) : new Date(),
        to: searchParams.get("to") ? new Date(searchParams.get("to")!) : new Date(),
    }

    const timeRange: TimeRange = {
        start: Number(searchParams.get("start") ?? 0),
        end: Number(searchParams.get("end") ?? 24),
    }

    // update URL
    const updateFilter = (key: string, value: string | number | undefined) => {
        setSearchParams((prev) => {
            if (value === undefined || value === null) {
                prev.delete(key)
            } else {
                prev.set(key, String(value))
            }
            return prev
        })
    }

    // URL handlers
    const handleDateRangeChange = (range: DateRange | undefined) => {
        setSearchParams((prev) => {
            if (range?.from) prev.set("from", range.from.toISOString())
            if (range?.to) prev.set("to", range.to.toISOString())
            return prev
        })
    }

    const handleTimeRangeChange = (range: TimeRange) => {
        setSearchParams((prev) => {
            prev.set("start", String(range.start))
            prev.set("end", String(range.end))
            return prev
        })
    }

    return (
        <div className='flex flex-col gap-md'>
            <div className='sticky top-0 z-10 bg-surface pb-sm border-border border-b-sm'>
                <FilterBar
                    gameType={gameType}
                    onGameTypeChange={(val) => updateFilter("gameType", val)}
                    sortType={sortType}
                    onSortTypeChange={(val) => updateFilter("sortType", val)}
                    dateRange={dateRange}
                    onDateRangeChange={handleDateRangeChange}
                    timeRange={timeRange}
                    onTimeRangeChange={handleTimeRangeChange}
                    statusType={statusType}
                    onStatusTypeChange={(val) => updateFilter("statusType", val)}
                />
            </div>
            <MatchList
                gameType={gameType}
                sortType={sortType}
                dateRange={dateRange}
                timeRange={timeRange}
                statusType={statusType}
            />
        </div>
    )
}