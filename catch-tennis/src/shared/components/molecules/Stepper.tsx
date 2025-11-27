import {useState} from "react"
import {
    MinusIcon,
    PlusIcon
} from "lucide-react"

import {Button} from "@shared/components/ui/button.tsx"

interface StepperProps {
    label: string
    min: number
    max: number
    onChange: (value: number) => void
}

export function Stepper({
                            label,
                            min,
                            max,
                            onChange,
                        }: StepperProps) {

    const [value, setValue] = useState<number>(min)

    const handleIncrement = () => {
        if (value < max) {
            const newValue = value + 1
            setValue(newValue)
            onChange(newValue)
        }
    }
    const handleDecrement = () => {
        if (value > min) {
            const newValue = value - 1
            setValue(newValue)
            onChange(newValue)
        }
    }

    return (
        <div className='flex justify-between items-center py-sm px-lg gap-md shadow-sm bg-surface-raised border-border border-sm rounded-sm'>
            <span className='text-heading-h4'>{label}</span>
            <div className='flex gap-sm items-center'>
                <Button
                    size={'icon-sm'}
                    disabled={value === max}
                    onClick={handleIncrement}><PlusIcon className='w-2 h-2'/></Button>
                <span>{value}</span>
                <Button
                    size={'icon-sm'}
                    disabled={value === min}
                    onClick={handleDecrement}><MinusIcon className='w-2 h-2'/></Button>
            </div>
        </div>
    )

}