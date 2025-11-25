import type {FormAdapter} from "@shared/types/adapter.ts"
import type {ProfileFormState} from "@shared/types/forms.ts"
import type {ProfileCompleteRequest} from "@shared/types/api.ts"
import type {AnswersState} from "@shared/types/common.ts"
import {Gender, Age, Period} from "@shared/types"


export const profileAdapter: FormAdapter<ProfileFormState, ProfileCompleteRequest> = {
    getInitialState: ():ProfileFormState => {
        return {
            nickname: '',
            gender: null,
            period: null,
            age: null
        }
    },

    updateFormState: (
        questionId, value, currentState
    ): ProfileFormState => {
        switch (questionId) {
            case 'nickname':
                return {
                    ...currentState,
                    nickname: String(value).trim()
                }
            case 'gender':
                if (!Object.values(Gender).includes(value as Gender)) {
                    console.warn(`ProfileAdapter: Invalid gender value: ${value}`)
                    return currentState
                }
                return {
                    ...currentState,
                    gender: value as Gender
                }
            case 'period':
                if (!Object.values(Period).includes(value as Period)) {
                    console.warn(`ProfileAdapter: Invalid period value: ${value}`)
                    return currentState
                }
                return {
                    ...currentState,
                    period: value as Period
                }
            case 'age':
                if (!Object.values(Age).includes(value as Age)) {
                    console.warn(`ProfileAdapter: Invalid age value: ${value}`)
                    return currentState
                }
                return {
                    ...currentState,
                    age: value as Age
                }
            default:
                console.warn(`ProfileAdapter: Unknown question ID: ${questionId}`)
                return currentState
        }
    },

    toApiRequest: (formState):ProfileCompleteRequest => {
        if (!formState.gender || !formState.period || !formState.age) {
            console.warn(`ProfileAdapter: api request body is null`)
            throw new Error('Incomplete form state')
        }
        return {
            nickname: formState.nickname,
            gender: formState.gender,
            period: formState.period,
            age: formState.age
        }
    },

    fromStorage: (answers: AnswersState): ProfileFormState => {
        return {
            nickname: answers.nickname || '',
            gender: (answers.gender as Gender) || null,
            period: (answers.period as Period) || null,
            age: (answers.age as Age) || null
        }
    },

    toStorage: (formState: ProfileFormState): AnswersState => {
        return {
            nickname: formState.nickname,
            gender: formState.gender || '',
            period: formState.period || '',
            age: formState.age || ''
        }
    },

    validate: (formState: ProfileFormState): string[] => {
        const errors: string[] = []
        if (!formState.nickname.trim()) {
            errors.push('닉네임을 입력해주세요')
        } else if (formState.nickname.length < 2) {
            errors.push('닉네임은 2자 이상이어야 합니다')
        } else if (formState.nickname.length > 20) {
            errors.push('닉네임은 20자 이하여야 합니다')
        }

        if (!formState.gender) {
            errors.push('성별을 선택해주세요')
        }

        if (!formState.period) {
            errors.push('구력을 선택해주세요')
        }

        if (!formState.age) {
            errors.push('나이를 선택해주세요')
        }

        return errors
    }
}