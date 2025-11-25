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
        <div>
            <span>시작 시간: {value.start}</span>
            <span>종료 시간: {value.end}</span>
            <Slider
                value={toSliderValue(value)}
                onValueChange={handleValueChange}
                min={0}
                max={24}
                step={1}
                minStepsBetweenThumbs={1}
            />
        </div>
    )
}