import {Button, InputText} from "@shared/components/atoms"
import {type Question} from "@shared/types/common.ts"

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
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col justify-center items-center gap-md">

                <span className="text-heading-h1 text-center">{question.heading}</span>
                {
                    question.type === 'button' && question.options
                    && (
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
                }

                {
                    question.type === 'input'
                    && (
                        <InputText
                            inputSize="big"
                            value={selectedValue}
                            type="text"
                            onChange={(e) => setSelectedValue(e.target.value)}
                            placeholder={question.placeholder}
                            autoFocus
                        />
                    )
                }
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