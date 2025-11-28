import {useEffect, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"

import {checkNicknameAvailability, postProfile} from "../api/profileApi.ts"
import {questions} from "../utils/questions.ts"
import {storage} from "../utils/storage.ts"

export function useCompleteProfile() {
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
            navigate('/profile-complete/1', {replace:true})
        }
    }, [question, questionIndex, navigate])

    const handleNext = async () => {
        if (!selectedValue.trim()) return

        storage.setAnswer(question.id, selectedValue.trim())

        if (questionIndex < questions.length - 1) {
            setIsSubmitting(true)
            try {
                if (questionIndex === 0) {
                    const {available} = await checkNicknameAvailability(selectedValue)
                    if (available) {
                        navigate(`/profile-complete/${questionIndex + 2}`)
                    } else {
                        alert('이미 사용중인 닉네임 입니다.')
                        return
                    }
                }
            } finally {
                setIsSubmitting(false)
            }
            navigate(`/profile-complete/${questionIndex + 2}`)
        } else {
            setIsSubmitting(true)
            try {
                const answers = storage.getAnswers()
                await postProfile(answers)
                storage.clearAnswers()
                navigate(`/match`, {replace: true, state: {from:'profileComplete'}})
            } catch (error) {
                console.error('CompleteProfileError:', error)
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
        isSubmitting
    }

}