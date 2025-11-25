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

export interface ProfileData {
    userId: number;
    nickname: string;
    period: string;
    gender: string;
    age: string;
    imgUrl?: string;
    name: string;
}