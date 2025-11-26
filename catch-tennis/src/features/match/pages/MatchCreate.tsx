import { useState } from "react"

import {CourtSearch} from "@features/match/components/CourtSearch.tsx"
import {Button, DatePicker, TimePicker} from "@shared/components/atoms"
import type {TimeRange} from "@shared/types"

export function MatchCreate() {
    const [step, setStep] = useState(0)
    const [courtId, setCourtId] = useState<string | null>(null)
    const [date, setDate] = useState(new Date())
    const [timeRange, setTimeRange] = useState<TimeRange>({start:0, end:24})

    console.log(`data: ${courtId}, ${date.toISOString()}, ${timeRange.start}-${timeRange.end}`)

    const elems = [
        <CourtSearch courtId={courtId} onCourtIdChange={setCourtId}/>,
        <div className='flex flex-1 flex-col justify-center items-center max-w-[300px]'>
            <div className='text-heading-h2 pb-lg'>날짜와 시간을 선택해 주세요</div>
            <DatePicker mode={'single'} date={date} onDateChange={setDate}/>
            <TimePicker border={false} value={timeRange} onTimeRangeChange={setTimeRange}/>
        </div>,
        <div></div>
    ]

    const activated = () => {
        if (step === 0 && courtId !== null) {
            return true
        } else if (step === 1) {
            return true
        }
        return false
    }

    const toNextStep = () => {
        setStep(step + 1)
    }

    return (
        <div className='flex flex-1 flex-col overflow-hidden py-lg items-center'>
            {elems[step]}
            <div className='sticky bottom-0 z-50 flex-none pt-sm bg-surface w-full'>
                <Button
                    buttonSize={'full'}
                    variant={activated() ? 'primary' : 'inactive'}
                    disabled={!activated()}
                    onClick={toNextStep}
                >넘어가기</Button>
            </div>
        </div>
    )
}