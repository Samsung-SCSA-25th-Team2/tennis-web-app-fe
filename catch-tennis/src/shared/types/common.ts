export type QuestionType = 'button' | 'input' | 'textarea' | 'count'

export interface ButtonOption {
    label: string;
    value: string;
}

export interface Question {
    id: string;
    heading: string;
    type: QuestionType;
    options?: ButtonOption[];
    placeholder?: string;
}

export interface AnswersState {
    [questionId: string]: string;
}
