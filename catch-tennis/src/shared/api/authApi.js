import {api} from './api'

/**
 * 회원가입
 */
export async function signUp(body) {
    return api.post('/v1/auth/signup', body)
}

/**
 * 닉네임 중복 확인
 */
export async function checkNickname(params) {
    return api.get('/v1/auth/check-nickname', {params})
}

/**
 * 로그인
 */
export async function login(body) {
    return api.post('/v1/auth/login', body)
}

/**
 * 토큰 재발급
 */
export async function refresh() {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
        return Promise.reject(new Error('No refresh token'))
    }
    return api.post('/v1/auth/refresh', {refreshToken})
}

/**
 * 로그아웃
 */
export async function logout() {
    const refreshToken = localStorage.getItem('refreshToken')
    return api.post('/v1/auth/logout', { refreshToken })
}

/**
 * 인증 상태 확인
 */
export async function getAuthStatus() {
    return api.get('/v1/auth/status', { useJWT: true })
}
