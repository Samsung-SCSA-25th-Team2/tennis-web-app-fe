import type {AnswersState} from "./types.ts"

const STORAGE_KEY = 'profileComplete'

export const storage = {
    getAnswers: (): AnswersState => {
        try {
            const data = localStorage.getItem(STORAGE_KEY)
            return data ? JSON.parse(data) : {}
        } catch (e) {
            console.error(`Failed to getAnswers: ${e}`)
            return {}
        }
    },
    
    setAnswer: (questionId: string, value: string): void => {
        try {
            const answers = storage.getAnswers()
            answers[questionId] = value
            localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
        } catch (e) {
            console.error(`Failed to setAnswers: ${e}`)
        }
    },
    
    clearAnswers: (): void => {
        try {
            localStorage.removeItem(STORAGE_KEY)
        } catch (e) {
            console.error(`Failed to clearAnswers: ${e}`)
        }
    }
}