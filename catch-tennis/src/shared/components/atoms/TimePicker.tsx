import {Slider} from "@shared/components/ui/slider.tsx"
import type {TimeRange} from "@shared/types/common.ts"

interface TimePickerProps {
    value: TimeRange
    onTimeRangeChange: (value: TimeRange) => void
}

export function TimePicker({
    value,
    onTimeRangeChange,
                           }: TimePickerProps) {

    const toSliderValue = (timeRange: TimeRange) => {
        return [timeRange.start, timeRange.end]
    }

    const handleValueChange = (value: number[]) => {
        onTimeRangeChange({
            start: value[0],
            end: value[1],
        })

    }

    return (
        <div className='flex flex-col justify-center items-center gap-sm pt-sm'>
            <span>시간대 선택: {value.start}시 ~ {value.end}시</span>
            <div className='w-full px-sm pb-md border-b-sm border-border'>
                <Slider
                    value={toSliderValue(value)}
                    onValueChange={handleValueChange}
                    min={0}
                    max={24}
                    step={1}
                    minStepsBetweenThumbs={1}
                />
            </div>
        </div>
    )
}