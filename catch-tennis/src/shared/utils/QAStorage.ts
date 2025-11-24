import {type AnswersState} from "../types/common.ts"

export function QAStorage(storageKey: string) {
    return {
        getAnswers: (): AnswersState => {
            try {
                const data = localStorage.getItem(storageKey)
                return data ? JSON.parse(data) : {}
            } catch (error) {
                console.error('Storage get error', error)
                return {}
            }
        },

        setAnswer: (questionId: string, value: string): void => {
            try {
                const answers = QAStorage(storageKey).getAnswers()
                answers[questionId] = value
                localStorage.setItem(storageKey, JSON.stringify(answers))
            } catch (error) {
                console.error('Storage set error', error)
            }
        },

        clearAnswers: (): void => {
            try {
                localStorage.removeItem(storageKey)
            } catch (error) {
                console.error('Storage clear error', error)
            }
        }
    }
}