import {api} from './api'
import type {LoginBody, LoginResult, RefreshResult, SignUpBody, SignUpResult, CheckNicknameParams, CheckNicknameResult, AuthStatus} from './types'

/**
 * 회원가입
 */
export async function signUp(body: SignUpBody): Promise<SignUpResult> {
    return api.post<SignUpResult>('/v1/auth/signup', body)
}

/**
 * 닉네임 중복 확인
 */
export async function checkNickname(params: CheckNicknameParams): Promise<CheckNicknameResult> {
    return api.get<CheckNicknameResult>('/v1/auth/check-nickname', {params})
}

/**
 * 로그인
 */
export async function login(body: LoginBody): Promise<LoginResult> {
    return api.post<LoginResult>('/v1/auth/login', body)
}

/**
 * 토큰 재발급
 */
export async function refresh(): Promise<RefreshResult> {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
        return Promise.reject(new Error('No refresh token'))
    }
    return api.post<RefreshResult>('/v1/auth/refresh', {refreshToken})
}

/**
 * 로그아웃
 */
export async function logout(): Promise<{ success: boolean; message: string }> {
    const refreshToken = localStorage.getItem('refreshToken')
    return api.post('/v1/auth/logout', { refreshToken });
}

/**
 * 인증 상태 확인
 */
export async function getAuthStatus(): Promise<AuthStatus> {
    return api.get<AuthStatus>('/v1/auth/status', { useJWT: true });
}
