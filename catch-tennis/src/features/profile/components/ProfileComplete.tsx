import {Button} from "@shared/components/ui/button.tsx"
import {Input} from "@shared/components/ui/input.tsx"

import {useCompleteProfile} from "../hooks/useCompleteProfile.tsx"


export function ProfileComplete() {
    const {
        question,
        selectedValue,
        setSelectedValue,
        handleNext,
        isSubmitting
    } = useCompleteProfile()

    return (
        <>
            <div className="flex flex-col h-full">
                <div className="flex-1 flex flex-col justify-center items-center gap-lg">

                    <span className="text-heading-h2 text-text-title text-center">{question.heading}</span>
                    {
                        question.type === 'button' && question.options
                        && (
                            <div className="flex gap-sm">
                                {
                                    question.options.map((option) => (
                                        <Button
                                            variant={selectedValue === option.value ? 'default' : 'outline'}
                                            size={'lg'}
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
                            <div className='flex flex-col'>
                                <Input
                                    className='text-center min-h-[40px]'
                                    value={selectedValue}
                                    onChange={(e)=>setSelectedValue(e.target.value.trim())}
                                    placeholder={question.placeholder}
                                    type='text'
                                    maxLength={30}
                                />
                                <span className='text-right text-caption text-text-muted'
                                >{selectedValue.length}/30</span>
                            </div>
                        )
                    }
                </div>


                <Button
                    variant={selectedValue.length > 0 ? 'default':'outline'}
                    disabled={selectedValue.length == 0 || isSubmitting}
                    size={"lg"}
                    onClick={handleNext}
                >
                    {
                        isSubmitting ? '제출중...' : '넘어가기'
                    }
                </Button>
            </div>
        </>
    )
}
