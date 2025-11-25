import {api} from "@shared/api/index.ts"

import type {UserStatus} from "@shared/types/common.ts"

export async function getAuthStatus(): Promise<UserStatus> {
    return api.get<UserStatus>("/v1/auth/status", {useJWT: true})
}
