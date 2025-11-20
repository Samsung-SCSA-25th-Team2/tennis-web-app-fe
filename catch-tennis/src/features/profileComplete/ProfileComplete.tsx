import {useEffect, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"

import {questions} from "./questions.ts"
import {storage} from "./storage.ts"
import {Button, InputText} from "../../shared/components/atoms"
import api from "../../shared/api/api.ts"


const ProfileComplete = () => {
    const {questionNumber} = useParams<{questionNumber:string}>()
    const navigate = useNavigate()
    const questionIndex = parseInt(questionNumber || '1') - 1
    const question = questions[questionIndex]

    const [selectedValue, setSelectedValue] = useState(() => {
        if (!question) return ''
        const savedAnswers = storage.getAnswers()
        return savedAnswers[question.id] || ''
    })

    useEffect(() => {
        if (!question || questionIndex < 0 || questionIndex >= questions.length) {
            navigate('/profile-complete/1', {replace: true})
        }
    }, [question, questionIndex, navigate])



    const handleNext = async () => {
        if (!selectedValue.trim()) return
        
        storage.setAnswer(question.id, selectedValue.trim())
        
        if (questionIndex < questions.length - 1) {
            navigate(`/profile-complete/${questionIndex + 2}`)
        } else {
            const answers = storage.getAnswers()
            try {
                await api.post(
                    '/v1/users/complete-profile',
                    answers,
                    {useJWT: true}
                )
                storage.clearAnswers()
                navigate('/match')
            } catch (e) {
                console.error(`Failed at POST ProfileComplete ${e}`)
                navigate('/error')
            }
        }
    }

    return (
        <>
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
                                            buttonSize='small'
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
                    onClick={handleNext}
                    buttonSize='big'
                    disabled={selectedValue.length == 0}
                    type="submit"
                >
                    넘어가기
                </Button>
            </div>
        </>
    )
}

export default ProfileComplete