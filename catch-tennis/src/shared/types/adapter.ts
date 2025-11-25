import type {AnswersState} from "./common.ts"

export interface FormAdapter<TFromState, TApiRequest> {
    updateFormState: (
        questionId: string,
        value: unknown,
        currentState: TFromState
    ) => TFromState

    getInitialState: () => TFromState

    toApiRequest: (formState: TFromState) => TApiRequest

    fromStorage: (answers: AnswersState) => TFromState

    toStorage: (formState: TFromState) => AnswersState

    validate?: (formState: TFromState) => string[]
}