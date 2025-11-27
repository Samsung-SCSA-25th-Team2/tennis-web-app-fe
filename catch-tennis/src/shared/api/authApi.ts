import {api} from './api'
import type {UserStatus} from '@shared/types/common'

// 회원가입 요청 바디 타입
export interface SignUpRequest {
    email?: string
    password?: string
    name?: string
    [key: string]: unknown
}

// 회원가입 응답 타입
export interface SignUpResponse {
    userId: number
    email: string
    message: string
}

// 닉네임 중복 확인 파라미터 타입
export interface CheckNicknameParams extends Record<string, string | number | boolean | undefined> {
    nickname: string
}

// 닉네임 중복 확인 응답 타입
export interface CheckNicknameResponse {
    available: boolean
}

// 로그인 요청 바디 타입
export interface LoginRequest {
    email?: string
    password?: string
    [key: string]: unknown
}

// 로그인 응답 타입
export interface LoginResponse {
    accessToken: string
    refreshToken: string
    tokenType: string
    expiresIn: number
}

// 로그아웃 응답 타입
export interface LogoutResponse {
    message: string
}

/**
 * 회원가입
 */
export async function signUp(body: SignUpRequest): Promise<SignUpResponse> {
    return api.post<SignUpResponse>('/v1/auth/signup', body)
}

/**
 * 닉네임 중복 확인
 */
export async function checkNickname(params: CheckNicknameParams): Promise<CheckNicknameResponse> {
    return api.get<CheckNicknameResponse>('/v1/auth/check-nickname', {params})
}

/**
 * 로그인
 */
export async function login(body: LoginRequest): Promise<LoginResponse> {
    return api.post<LoginResponse>('/v1/auth/login', body)
}

/**
 * 로그아웃
 */
export async function logout(): Promise<LogoutResponse> {
    return api.post<LogoutResponse>('/v1/auth/logout')
}

/**
 * 인증 상태 확인
 */
export async function getAuthStatus(): Promise<UserStatus> {
    return api.get<UserStatus>('/v1/auth/status', {useJWT: true})
}