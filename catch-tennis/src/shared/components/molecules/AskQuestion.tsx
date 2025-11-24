import {Button, InputText, Textarea, Count} from "@shared/components/atoms"
import {type Question} from "@shared/types"


interface AskQuestionProps {
    question: Question
    selectedValue: string
    setSelectedValue: (selectedValue: string) => void
    clickHandler: () => void
    isSubmitting: boolean
}

export function AskQuestion({
   question,
    selectedValue,
    setSelectedValue,
    clickHandler,
    isSubmitting,
                            }: AskQuestionProps) {

    let questionElem
    if (question.type === 'button' && question.options) {
        questionElem = (
                <div className="flex gap-sm">
                    {
                        question.options.map((option) => (
                            <Button
                                variant={selectedValue === option.value ? 'primary' : 'inactive'}
                                buttonSize='sm'
                                key={option.value}
                                onClick={() => setSelectedValue(option.value)}
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
                value={selectedValue}
                type="text"
                onChange={(e) => setSelectedValue(e.target.value)}
                placeholder={question.placeholder}
                autoFocus
            />
        )

    } else if (question.type === 'textarea' && question.placeholder) {
        questionElem = (
            <Textarea
                textareaSize={'full'}
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
                placeholder={question.placeholder}
                autoFocus
            />
        )
    } else if (question.type === 'count' && question.options) {
        questionElem = (
            <div className='flex flex-col w-full px-xl gap-sm'>
                {
                    question.options.map((option) => (
                        <Count label={option.label} value={option.value}></Count>
                    ))
                }

            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col justify-center items-center gap-md">
                <span className="text-heading-h1 text-center">{question.heading}</span>
                {questionElem}
            </div>

            <Button
                variant={selectedValue.length > 0 ? 'primary' : 'inactive'}
                onClick={clickHandler}
                buttonSize='full'
                disabled={selectedValue.length == 0 || isSubmitting}
                type="submit"
            >
                {
                    isSubmitting ? '제출중...' : '넘어가기'
                }
            </Button>
        </div>
        )
}