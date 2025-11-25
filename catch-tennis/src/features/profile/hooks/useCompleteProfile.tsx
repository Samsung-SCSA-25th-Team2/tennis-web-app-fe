import {useEffect, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"

import {postProfile} from "../api/profileApi.ts"
import {questions} from "../utils/questions.ts"
import {storage} from "../utils/storage.ts"
import {profileAdapter} from "../utils/profileAdapter.ts"
import type {ProfileFormState} from "@shared/types/forms"


export function useCompleteProfile() {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const {questionNumber} = useParams<{questionNumber:string}>()
    const questionIndex = parseInt(questionNumber || '1') - 1
    const question = questions[questionIndex]

    const [formState, setFormState] = useState<ProfileFormState>(() => {
        const savedAnswers = storage.getAnswers()
        return profileAdapter.fromStorage(savedAnswers)
    })

    const currentValue = formState[question?.id as keyof ProfileFormState] || ''

    const setSelectedValue = (value: string) => {
        if (!question) return

        const newFormState = profileAdapter.updateFormState(
            question.id,
            value,
            formState
        )

        setFormState(newFormState)

        const storageData = profileAdapter.toStorage(newFormState)
        Object.entries(storageData).forEach(([key, val]) => {
            storage.setAnswer(key, val)
        })
    }

    useEffect(() => {
        if (!question || questionIndex < 0 || questionIndex >= questions.length) {
            navigate('/profile-complete/1', {replace:true})
        }
    }, [question, questionIndex, navigate])

    const handleNext = async () => {
        const currentVal = currentValue as string
        if (!currentVal || !currentVal.trim()) {
            return
        }

        if (questionIndex < questions.length - 1) {
            navigate(`/profile-complete/${questionIndex + 2}`)
        } else {
            setIsSubmitting(true)
            try {
                const errors = profileAdapter.validate?.(formState) || []
                if (errors.length > 0) {
                    alert(errors.join('\n'))
                    setIsSubmitting(false)
                    return
                }

                const apiRequest = profileAdapter.toApiRequest(formState)
                await postProfile(apiRequest)

                storage.clearAnswers()

                navigate('/match')
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
        selectedValue: currentValue,
        setSelectedValue,
        handleNext,
        isSubmitting
    }

}