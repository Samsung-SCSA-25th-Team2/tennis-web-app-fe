import type {Period, Gender, Age} from '@shared/types'

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
    period: Period;
    gender: Gender;
    age: Age;
    imgUrl?: string;
    name: string;
}