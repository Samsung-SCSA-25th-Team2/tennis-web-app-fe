import {api} from '@shared/api'
import type {ProfileData} from "@shared/types/common.ts"
import type {AnswersState} from "../common.ts"

export async function postProfile(answers: AnswersState) {
    return api.post(
        '/v1/users/complete-profile',
        answers,
        {useJWT: true}
    )
}

/**
 * 사용자 프로필 조회 (본인 포함 모든 사용자)
 * JWT 불필요 - 공개 API
 */
export async function getProfile(userId: number | string) {
    return api.get<ProfileData>(
        `/v1/users/${userId}`,
        {useJWT: false}
    )
}

/**
 * 프로필 업데이트 (본인만 가능)
 * JWT 필요 - 인증된 사용자만
 */
export async function updateProfile(profileData: ProfileData) {
    return api.patch<ProfileData>(
        '/v1/users/me/update',
        profileData,
        {useJWT: true}
    )
}

/**
 * 계정 삭제 (본인만 가능)
 * JWT 필요 - 인증된 사용자만
 */
export async function deleteProfile() {
    return api.delete(
        '/v1/users/me/delete',
        {useJWT: true}
    )
}

/**
 * 닉네임 중복 체크
 * JWT 불필요 - 공개 API
 */
export async function checkNicknameAvailability(nickname: string) {
    return api.get<{ available: boolean }>(
        '/v1/users/check-nickname',
        {
            useJWT: false,
            params: { nickname }
        }
    )
}