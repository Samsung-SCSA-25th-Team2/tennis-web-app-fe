
export interface Answer {
    questionId: string;
    value: string;
}

export interface AnswersState {
    [questionId: string]: string;
}