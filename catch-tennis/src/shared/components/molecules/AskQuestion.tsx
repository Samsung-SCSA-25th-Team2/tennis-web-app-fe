import {Button, InputText, Textarea, Count} from "@shared/components/atoms"
import {type Question} from "@shared/types"
import type {JSX} from "react"


interface AskQuestionProps<T = string> {
    question: Question
    value: T
    onChange: (value: T) => void
    onNext: () => void
    isSubmitting: boolean
}

export function AskQuestion<T = string>({
    question,
    value,
    onChange,
    onNext,
    isSubmitting,
                            }: AskQuestionProps<T>) {

    let questionElem: JSX.Element | null = null

    if (question.type === 'button' && question.options) {
        questionElem = (
            <div className="flex gap-sm">
                {
                    question.options.map((option) => (
                        <Button
                            variant={value === (option.value as T) ? 'primary' : 'inactive'}
                            buttonSize='sm'
                            key={option.value}
                            onClick={() => onChange(option.value as T)}
                        >
                            {option.label}
                        </Button>
                    ))
                }
            </div>
        )
    } else if (question.type === 'button-multi' && question.options) {
        const selectedValues = (value as unknown) as string[]
        const isSelected = (optionValue: string) => {
            return selectedValues.includes(optionValue)
        }

        questionElem = (
            <div className="flex gap-sm flex-wrap">
                {
                    question.options.map((option) => (
                        <Button
                            variant={isSelected(option.value) ? 'primary' : 'inactive'}
                            buttonSize='sm'
                            key={option.value}
                            onClick={() => {
                                const newSelection = isSelected(option.value)
                                    ? selectedValues.filter(v => v !== option.value)
                                    : [...selectedValues, option.value]
                                onChange(newSelection as T)
                            }}
                        >
                            {option.label}
                        </Button>
                    ))
                }
            </div>
        )

    } else if (question.type === 'input') {
        questionElem = (
            <InputText
                inputSize="big"
                value={value as string}
                type={question.inputType || "text"}
                onChange={(e) => onChange(e.target.value as T)}
                placeholder={question.placeholder}
                autoFocus
            />
        )

    } else if (question.type === 'textarea' && question.placeholder) {
        questionElem = (
            <Textarea
                textareaSize={'full'}
                value={value as string}
                onChange={(e) => onChange(e.target.value as T)}
                placeholder={question.placeholder}
                autoFocus
            />
        )
    } else if (question.type === 'count' && question.options) {
        const counts = (value as unknown) as Record<string, number>

        questionElem = (
            <div className='flex flex-col w-full px-xl gap-sm'>
                {
                    question.options.map((option) => (
                        <Count
                            key={option.value}
                            label={option.label}
                            value={counts[option.value] || 0}
                            onChange={(newCount) => {
                                const newCounts = {
                                    ...counts,
                                    [option.value]: newCount
                                }
                                onChange(newCounts as T)
                            }}
                        />
                    ))
                }

            </div>
        )
    }

    const isValueValid = (): boolean => {
        if (value === null || value === undefined) return false

        if (typeof value === 'string') {
            return value.trim().length > 0
        }

        if (Array.isArray(value)) {
            return value.length > 0
        }

        if (typeof value === 'object') {
            return Object.values(value).some(v => v > 0)
        }

        return true
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col justify-center items-center gap-md">
                <span className="text-heading-h1 text-center">{question.heading}</span>
                {questionElem}
            </div>

            <Button
                variant={isValueValid() ? 'primary' : 'inactive'}
                onClick={onNext}
                buttonSize='full'
                disabled={!isValueValid() || isSubmitting}
                type="submit"
            >
                {
                    isSubmitting ? '제출중...' : '넘어가기'
                }
            </Button>
        </div>
        )
}