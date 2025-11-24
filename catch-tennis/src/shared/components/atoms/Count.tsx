import {useState} from "react"
import {Button} from "@shared/components/atoms/Button.tsx"

interface CountProps {
    label: string
    value: string
}

export function Count({
    label,
                      }: CountProps) {

    const [count, setCount] = useState(0)

    const maxVal = 10
    const minVal = 0

    const onClickPlus = () => {
        const newCount = count + 1
        if (newCount <= maxVal) {
            setCount(newCount)
        } else {
            setCount(maxVal)
        }
    }
    const onClickMinus = () => {
        const newCount = count - 1
        if (newCount >= minVal) {
            setCount(newCount)
        } else {
            setCount(minVal)
        }
    }

    return (
        <div className='flex w-full justify-between items-center py-sm px-md d gap-md bg-surface border-border border-sm rounded-sm'>
            <span className='text-heading-h4'>{label}</span>
            <div className='flex justify-center items-center gap-md'>
                <Button
                    variant={count == maxVal ? 'inactive' : 'primary'}
                    buttonSize={'xs'} onClick={onClickPlus}
                >+</Button>
                <span className='w-5 text-center'>{count}</span>
                <Button
                    variant={count == minVal ? 'inactive' : 'primary'}
                    buttonSize={'xs'} onClick={onClickMinus}
                >-</Button>
            </div>
        </div>
    )
}