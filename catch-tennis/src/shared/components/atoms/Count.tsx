import {Button} from "@shared/components/atoms/Button.tsx"

interface CountProps {
    label: string
    value: number
    onChange: (newValue: number) => void
    min?: number
    max?: number
}

export function Count({
    label,
    value,
    onChange,
    min = 0,
    max = 10
                      }: CountProps) {
    const handleIncrement = () => {
        if (value < max) {
            onChange(value + 1)
        }
    }

    const handleDecrement = () => {
        if (value > min) {
            onChange(value - 1)
        }
    }

    return (
        <div className='flex w-full justify-between items-center py-sm px-md d gap-md bg-surface border-border border-sm rounded-sm'>
            <span className='text-heading-h4'>{label}</span>
            <div className='flex justify-center items-center gap-md'>
                <Button
                    variant={value == max ? 'inactive' : 'primary'}
                    buttonSize={'xs'} onClick={handleIncrement}
                >+</Button>
                <span className='w-5 text-center'>{value}</span>
                <Button
                    variant={value == min ? 'inactive' : 'primary'}
                    buttonSize={'xs'} onClick={handleDecrement}
                >-</Button>
            </div>
        </div>
    )
}