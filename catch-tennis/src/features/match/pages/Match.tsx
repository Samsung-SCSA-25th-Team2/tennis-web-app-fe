import {useNavigate, useSearchParams} from "react-router-dom"
import type {DateRange} from "react-day-picker"
import {Plus} from "lucide-react"

import {GameType} from "@shared/types"
import type {TimeRange} from "@shared/types/common.ts"

import {FilterBar} from "../components/FilterBar.tsx"
import {MatchList} from "../components/MatchList.tsx"
import type {SortType, StatusType} from "../common.ts"
import {Button} from "@shared/components/ui/button.tsx"


export function Match() {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    const gameType = (searchParams.get("gameType") as GameType) || GameType.ALL
    const sortType = (searchParams.get("sortType") as SortType) || "latest"
    const statusType = (searchParams.get("statusType") as StatusType) || "RECRUITING"

    const dateRange: DateRange = {
        from: searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined,
        to: searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined,
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

    const toMatchCreate = () => {
        navigate('/match/create')
    }

    return (
        <div className='flex flex-col gap-md pb-32'>
            <div className='sticky top-0 z-10 border-border border-b-sm bg-surface pb-sm'>
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
            <div className='flex-1 min-h-0 overflow-y-auto scrollbar-hide'>
                <MatchList
                    gameType={gameType}
                    sortType={sortType}
                    dateRange={dateRange}
                    timeRange={timeRange}
                    statusType={statusType}
                />
            </div>
            <section className='sticky bottom-4 z-40'>
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface/90 p-4 shadow-lg backdrop-blur">
                    <div className="flex-1">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted">
                            Match Post
                        </p>
                        <p className="text-sm font-medium text-text-title">
                            새로운 매치 글을 올려보세요
                        </p>
                    </div>
                    <Button
                        size={'lg'}
                        onClick={toMatchCreate}
                        className="flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus className="h-4 w-4"/>
                        글쓰기
                    </Button>
                </div>
            </section>
        </div>
    )
}
