import {useNavigate, useParams} from "react-router-dom"
import {useEffect, useState} from "react"

import {questions} from "../utils/questions.ts"
import {storage} from "../utils/storage.ts"

export function useMatchCreate() {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const {questionNumber} = useParams<{questionNumber:string}>()
    const questionIndex = parseInt(questionNumber || '1') - 1
    const question = questions[questionIndex]

    const [selectedValue, setSelectedValue] = useState(() => {
        if (!question) return ''
        const savedAnswers = storage.getAnswers()
        return savedAnswers[question.id] || ''
    })

    useEffect(() => {
        if (!question || questionIndex < 0 || questionIndex >= questions.length) {
            navigate('/match-create/1', {replace:true})
        }
    }, [question, questionIndex, navigate])

    const handleNext = async () => {
        if (!selectedValue.trim()) return

        storage.setAnswer(question.id, selectedValue.trim())

        if (questionIndex < questions.length - 1) {
            navigate(`/match-create/${questionIndex + 2}`)
        } else {
            setIsSubmitting(true)
            try {
                // const answers = storage.getAnswers()
                // TODO: add post -> get created match id -> redirect to match details
                storage.clearAnswers()
                navigate('/match')
            } catch (error) {
                console.log('MatchCreateError:', error)
                navigate('/error')
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    return {
        question,
        selectedValue,
        setSelectedValue,
        handleNext,
        isSubmitting,
    }
}