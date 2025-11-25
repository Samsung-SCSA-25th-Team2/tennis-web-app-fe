export type QuestionType =
    'button'
    | 'button-multi'
    | 'input'
    | 'textarea'
    | 'count'
    | 'search'
    | 'datetime'

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
    inputType?: 'text' | 'number'
}

export interface AnswersState {

    [questionId: string]: string;
}
