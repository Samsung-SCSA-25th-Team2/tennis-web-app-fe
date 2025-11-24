import {api} from "@shared/api"

import type {UserStatus} from "../common.ts"

export async function getAuthStatus(): Promise<UserStatus> {
    return api.get<UserStatus>("/v1/auth/status", {useJWT: true})
}
