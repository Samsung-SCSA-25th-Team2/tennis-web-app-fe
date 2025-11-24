import {api} from '@shared/api'
import type {AnswersState} from "../common.ts"

export async function postProfile(answers: AnswersState) {
    return api.post(
        '/v1/users/complete-profile',
        answers,
        {useJWT:true}
    )
}