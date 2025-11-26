import type {DateRange} from "react-day-picker"
import {CalendarIcon} from "lucide-react"
import {format} from "date-fns"
import {ko} from "date-fns/locale"

import {DatePicker, TimePicker} from "@shared/components/atoms"
import type {TimeRange} from "@shared/types/common.ts"
import {Popover, PopoverContent, PopoverTrigger} from "@shared/components/ui/popover.tsx"
import {Button} from "@shared/components/ui/button.tsx"
import {cn} from "@shared/lib/utils.ts"


interface DateTimeSelectorProps {
    dateRange: DateRange
    onDateRangeChange: (dateRange: DateRange) => void
    timeRange: TimeRange
    onTimeRangeChange: (timeRange: TimeRange) => void
}

export function DateTimeSelector({
    dateRange,
    onDateRangeChange,
    timeRange,
    onTimeRangeChange,
                                 }: DateTimeSelectorProps) {

    const formatStartDate = (date: Date) => format(date, "yyyy년 MM월 dd일", {locale: ko})
    const formatEndDate = (date: Date) => format(date, "MM월 dd일", {locale: ko})

    const formatDateRangeText = () => {
        if (!dateRange?.from) return null
        if (!dateRange.to) {
            return '종료 날짜를 선택해 주세요'
        }
        return `${formatStartDate(dateRange.from)} - ${formatEndDate(dateRange.to)}`
    }

    const formatTimeRangeText = () => {
        return `${timeRange.start}시-${timeRange.end}시`
    }

    const dateRangeText = formatDateRangeText()
    const timeRangeText = formatTimeRangeText()

    return (
        <div className='w-full'>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full h-full justify-start text-left font-normal",
                            !dateRangeText && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon/>
                        {dateRangeText}: {timeRangeText}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0"
                    align={'start'}
                >
                    <TimePicker value={timeRange} onTimeRangeChange={onTimeRangeChange}/>
                    <DatePicker mode={'range'} dateRange={dateRange} onDateRangeChange={onDateRangeChange}/>
                </PopoverContent>
            </Popover>
        </div>

    )
}
