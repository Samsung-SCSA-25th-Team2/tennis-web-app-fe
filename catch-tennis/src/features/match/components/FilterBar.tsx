import type {DateRange} from "react-day-picker"
import {format} from "date-fns"
import {ko} from "date-fns/locale"

import {Button} from "@shared/components/atoms"
import type {GameType} from "@shared/types"
import type {TimeRange} from "@shared/types/common.ts"
import {getGametypeLabel} from "@shared/utils/toLabel.ts"
import {DateTimeSelector} from "@shared/components/organisms"

import {getSortTypeLabel, getStatusTypeLabel, type SortType, type StatusType} from "@features/match/common.ts"


interface FilterBarProps {
    gameType: GameType,
    onGameTypeChange: (game: GameType) => void,
    sortType: SortType,
    onSortTypeChange: (sortType: SortType) => void,
    dateRange: DateRange,
    onDateRangeChange: (dateRange: DateRange) => void,
    timeRange: TimeRange,
    onTimeRangeChange: (timeRange: TimeRange) => void,
    status: StatusType,
    onStatusChange: (status: StatusType) => void,
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
    status,
    onStatusChange,
                          }: FilterBarProps) {

    const formatDateTimeRange = (dateRange: DateRange, timeRange: TimeRange) => {
        if (dateRange.from === undefined || dateRange.to === undefined) {
            return ''
        }
        const startString = format(dateRange.from, 'MM월 dd일', {locale:ko})
        const endString = format(dateRange.to, "dd일", {locale:ko})
        return `${startString}~${endString}, ${timeRange.start}시~${timeRange.end}시`
    }

    return (
        <div className="flex flex-col gap-xs">
            // TODO: use dropdowns
            <div className='flex justify-between'>
                <Button buttonSize={'lg'}>{getSortTypeLabel(sortType)}</Button>
                <Button buttonSize={'lg'}>{getGametypeLabel(gameType)}</Button>
            </div>
            <div className='flex justify-between gap-lg'>
                <DateTimeSelector
                    dateRange={dateRange}
                    onDateRangeChange={onDateRangeChange}
                    timeRange={timeRange}
                    onTimeRangeChange={onTimeRangeChange}
                />
                <Button buttonSize={'lg'}>{getStatusTypeLabel(status)}</Button>
            </div>
        </div>
    )
}
