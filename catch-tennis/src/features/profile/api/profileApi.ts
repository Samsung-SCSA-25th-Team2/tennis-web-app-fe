import {api} from '@shared/api'
import type {ProfileData} from "@shared/types/common.ts"
import type {AnswersState} from "../common.ts"

export async function postProfile(answers: AnswersState) {
    return api.post(
        '/v1/users/complete-profile',
        answers,
        {useJWT:true}
    )
}

export async function getProfile(userId: number | string) {
    return api.get<ProfileData>(
        `/v1/users/${userId}`,
        {useJWT: true}
    )
}

export async function getMyProfile() {
    return api.get<ProfileData>(
        '/v1/users/me',
        {useJWT: true}
    )
}

export async function updateProfile(profileData: ProfileData) {
    return api.patch<ProfileData>(
        '/v1/users/me/update',
        profileData,
        {useJWT: true}
    )
}

export async function deleteProfile() {
    return api.delete(
        '/v1/users/me/delete',
        {useJWT: true}
    )
}

export async function checkNicknameAvailability(nickname: string) {
    return api.get<{ available: boolean }>(
        '/v1/users/check-nickname',
        {
            useJWT: false,
            params: { nickname }
        }
    )
}