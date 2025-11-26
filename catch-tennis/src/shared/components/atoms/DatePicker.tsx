import {Calendar} from "@shared/components/ui/calendar.tsx"
import type {DateRange} from "react-day-picker"


interface SingleDatePickerProps {
    mode: "single"
    date?: Date
    onDateChange?: (date: Date) => void
    placeholder?: string
    disabled?: boolean
}

interface DoubleDatePickerProps {
    mode: "multiple"
    dates?: Date[]
    onDatesChange?: (dates: Date[]) => void
    placeholder?: string
    disabled?: boolean
}

interface RangeDatePickerProps {
    mode: "range"
    dateRange?: DateRange
    onDateRangeChange?: (range: DateRange) => void
}

type DataPickerProps = SingleDatePickerProps | DoubleDatePickerProps | RangeDatePickerProps

export function DatePicker(props: DataPickerProps) {
    const {mode } = props
    

    const getCalendar = (mode: "single" | "multiple" | "range") => {
        switch (mode) {
            case "single":
            {
                const {date, onDateChange} = props as SingleDatePickerProps

                return (<Calendar
                    mode={"single"}
                    required={true}
                    selected={date}
                    onSelect={onDateChange}
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
                    numberOfMonths={1}
                />)

            }
        }
    }

    return (
        <>{getCalendar(mode)}</>
    )
}