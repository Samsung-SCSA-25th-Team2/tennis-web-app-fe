import {TimePicker, DatePicker} from "@shared/components/atoms"
import {useState} from "react"
import type {DateRange} from "react-day-picker";

export function MatchCreate() {
    const [date, setDate] = useState<Date>(new Date())
    const [dates, setDates] = useState<Array<Date>>([])
    const [dateRange, setDateRange] = useState<DateRange>()

    return (
        <div>
            <TimePicker/>
            <DatePicker
                mode={'single'}
                date={date}
                onDateChange={setDate}
                placeholder={"시작 날짜를 선택하세요"}
            />
            <DatePicker
                mode={'multiple'}
                dates={dates}
                onDatesChange={setDates}
                placeholder={"시작 날짜를 선택하세요"}
            />
            <DatePicker
                mode={'range'}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                placeholder={"시작 날짜를 선택하세요"}
            />

            {
                date && (
                    <span className='text-heading-h1'>
                        값: {date.toLocaleDateString("ko-KR")}
                    </span>
                )
            }

            {
                dates.length > 0 && (
                    <span>
                        DATES: {dates.map((d) => d.toLocaleDateString("ko-KR"))}
                    </span>
                )
            }

            {
                dateRange && (
                    <span className='text-heading-h1'>
                        {dateRange?.from?.toLocaleDateString()} - {dateRange?.to?.toLocaleDateString()}
                    </span>
                )
            }
        </div>
    )
}