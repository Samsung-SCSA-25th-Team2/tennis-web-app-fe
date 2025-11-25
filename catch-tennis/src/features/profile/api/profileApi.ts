import {api} from '@shared/api'
import type {ProfileCompleteRequest} from '@shared/types/api'

export async function postProfile(request: ProfileCompleteRequest) {
    return api.post(
        '/v1/users/complete-profile',
        request,
        {useJWT:true}
    )
}