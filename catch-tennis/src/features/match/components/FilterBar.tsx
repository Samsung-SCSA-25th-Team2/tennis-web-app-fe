import type {DateRange} from "react-day-picker"

import type {GameType} from "@shared/types"
import type {TimeRange} from "@shared/types/common.ts"
import {GAME_TYPE_OPTIONS} from "@shared/utils/toLabel.ts"
import {DateTimeSelector} from "@shared/components/organisms"

import {
    SORT_TYPE_OPTIONS,
    type SortType, STATUS_TYPE_OPTIONS,
    type StatusType
} from "@features/match/common.ts"
import {FilterDropdown} from "@features/match/components/FilterDropdown.tsx"


interface FilterBarProps {
    gameType: GameType,
    onGameTypeChange: (game: GameType) => void,
    sortType: SortType,
    onSortTypeChange: (sortType: SortType) => void,
    dateRange: DateRange,
    onDateRangeChange: (dateRange: DateRange) => void,
    timeRange: TimeRange,
    onTimeRangeChange: (timeRange: TimeRange) => void,
    statusType: StatusType,
    onStatusTypeChange: (status: StatusType) => void,
}

export function FilterBar({
    gameType,
    onGameTypeChange,
    sortType,
    onSortTypeChange,
    dateRange,
    onDateRangeChange,
    timeRange,
    onTimeRangeChange,
    statusType,
    onStatusTypeChange,
                          }: FilterBarProps) {


    return (
        <div className="flex flex-col gap-sm">
            <div className='flex justify-between'>
                <FilterDropdown
                    value={sortType}
                    options={SORT_TYPE_OPTIONS}
                    onChange={onSortTypeChange}
                    placeholder={'정렬'}/>
                <FilterDropdown
                    value={gameType}
                    options={GAME_TYPE_OPTIONS}
                    onChange={onGameTypeChange}
                    placeholder={'게임타입'}/>
                <FilterDropdown
                    value={statusType}
                    options={STATUS_TYPE_OPTIONS}
                    onChange={onStatusTypeChange}
                    placeholder={'상태'}/>
            </div>
            <div className='flex justify-between gap-lg'>
                <DateTimeSelector
                    dateRange={dateRange}
                    onDateRangeChange={onDateRangeChange}
                    timeRange={timeRange}
                    onTimeRangeChange={onTimeRangeChange}
                />
            </div>
        </div>
    )
}
