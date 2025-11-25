import {Popover, PopoverContent, PopoverTrigger} from "@shared/components/ui/popover.tsx"
import {Button} from "@shared/components/ui/button.tsx"
import {CalculatorIcon} from "lucide-react"
import {cn} from "@shared/lib/utils.ts"
import {format} from "date-fns"
import {Calendar} from "@shared/components/ui/calendar.tsx"
import {ko} from "date-fns/locale"
import type {DateRange} from "react-day-picker";


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
    placeholder?: string
    disabled?: boolean
}

type DataPickerProps = SingleDatePickerProps | DoubleDatePickerProps | RangeDatePickerProps

export function DatePicker(props: DataPickerProps) {
    const {mode, placeholder, disabled = false} = props
    
    const formatDate = (date: Date) => format(date, "yyyy년 MM월 dd일", {locale: ko})
    
    const formatDisplayText = () => {
        switch (mode) {
            case "single": {
                const {date} = props
                return date ? formatDate(date) : null
            }
            case "multiple": {
                const {dates} = props
                if (!dates || !dates.length) return null
                return dates.map((d) => formatDate(d)).join(", ")
            }
            case "range": {
                const {dateRange} = props
                if (!dateRange?.from) return null
                if (!dateRange.to) {
                    return formatDate(dateRange.from)
                }
                return `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
            }
        }
    }

    const displayText = formatDisplayText()

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
                    numberOfMonths={2}
                />)

            }
        }
    }

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !displayText && "text-muted-foreground"
                        )}
                        disabled={disabled}
                    >
                        <CalculatorIcon />
                        {displayText ? displayText : <span>{placeholder}</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0"
                    align={'start'}
                >
                    {getCalendar(mode)}
                </PopoverContent>
            </Popover>
        </>
    )
}