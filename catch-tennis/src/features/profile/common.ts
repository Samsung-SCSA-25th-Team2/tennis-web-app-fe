export type QuestionType = 'button' | 'input';

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

export interface Answer {
    questionId: string;
    value: string;
}

export interface AnswersState {
    [questionId: string]: string;
}