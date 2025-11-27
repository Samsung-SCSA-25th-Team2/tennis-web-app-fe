import {Calendar} from "@shared/components/ui/calendar.tsx"
import type {DateRange} from "react-day-picker"


interface SingleDatePickerProps {
    mode: "single"
    date?: Date
    onDateChange?: (date: Date) => void
    placeholder?: string
    disabled?: boolean
    fromCurrentDate?: boolean
}

interface DoubleDatePickerProps {
    mode: "multiple"
    dates?: Date[]
    onDatesChange?: (dates: Date[]) => void
    placeholder?: string
    disabled?: boolean
    fromCurrentDate?: boolean
}

interface RangeDatePickerProps {
    mode: "range"
    dateRange?: DateRange
    onDateRangeChange?: (range: DateRange) => void
    fromCurrentDate?: boolean
}

type DataPickerProps = SingleDatePickerProps | DoubleDatePickerProps | RangeDatePickerProps

export function DatePicker(props: DataPickerProps) {
    const {mode, fromCurrentDate = false} = props

    const cur = new Date()

    const getCalendar = (mode: "single" | "multiple" | "range") => {
        const disabledDays = fromCurrentDate ? { before: cur } : undefined
        switch (mode) {
            case "single":
            {
                const {date, onDateChange} = props as SingleDatePickerProps

                return (<Calendar
                    mode={"single"}
                    required={true}
                    selected={date}
                    onSelect={onDateChange}
                    disabled={disabledDays}
                />)
            }
            case "multiple":
            {
                const {dates, onDatesChange} = props as DoubleDatePickerProps

                return (<Calendar
                    mode={"multiple"}
                    required={true}
                    selected={dates}
                    onSelect={onDatesChange}
                    disabled={disabledDays}
                    max={2}
                />)
            }
            case "range":
            {
                const {dateRange, onDateRangeChange} = props as RangeDatePickerProps

                return (<Calendar
                    mode={"range"}
                    required={true}
                    selected={dateRange}
                    onSelect={onDateRangeChange}
                    disabled={disabledDays}
                    numberOfMonths={1}
                />)

            }
        }
    }

    return (
        <>{getCalendar(mode)}</>
    )
}