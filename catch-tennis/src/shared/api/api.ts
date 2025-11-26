import { apiUrl as API_BASE_URL } from "@shared/types/common.ts"

interface RefreshTokenResponse {
    accessToken: string
    refreshToken: string
    tokenType: string
    expiresIn: number
}

// 토큰 갱신 요청 중복을 방지하기 위한 Promise
// - 동시에 여러 요청이 401을 만나도 하나의 갱신 요청만 보내고
//   나머지는 이 Promise를 기다리도록 하는 용도
let refreshPromise: Promise<string> | null = null

/**
 * 리프레시 토큰(쿠키)을 이용해 액세스 토큰을 갱신하는 함수
 * - 성공 시 새 액세스 토큰을 localStorage에 저장
 * - 실패 시 에러를 던짐
 */
async function refreshAccessToken(): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
        method: "POST",
        credentials: "include", // 리프레시 토큰이 들어있는 쿠키 전송
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        // 4xx, 5xx 등의 상태 코드인 경우
        throw new Error("Token refresh failed")
    }

    const data = (await response.json()) as RefreshTokenResponse
    // 새 액세스 토큰 저장
    localStorage.setItem("accessToken", data.accessToken)
    return data.accessToken
}

// 사용 가능한 HTTP 메서드 타입 제한
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

// 공통 API 옵션 타입
interface ApiOptions {
    // true 이면 Authorization: Bearer <JWT> 헤더를 자동으로 붙임
    useJWT?: boolean
    // true 이면 credentials: "include" 로 설정하여 쿠키 전송
    useCredentials?: boolean
    // 추가로 넣고 싶은 커스텀 헤더
    headers?: Record<string, string>
    // 쿼리 스트링으로 변환할 파라미터 객체
    params?: Record<string, string | number | boolean>
}

/**
 * params 객체를 URL 쿼리 스트링으로 변환하는 헬퍼 함수
 * - params가 없거나 비어 있으면 빈 문자열 반환
 * - 예: { page: 1, q: "test" } -> "?page=1&q=test"
 */
function buildQueryString(params?: Record<string, string | number | boolean>): string {
    if (!params || Object.keys(params).length === 0) return ""

    const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
            acc[key] = String(value)
            return acc
        }, {} as Record<string, string>),
    ).toString()

    return queryString ? `?${queryString}` : ""
}

/**
 * 실제 fetch를 수행하는 공통 API 호출 함수
 *
 * 특징:
 * - JWT 사용 옵션(useJWT)에 따라 Authorization 헤더 자동 설정
 * - 401 + useJWT 인 경우, 액세스 토큰 갱신 후 한 번 재시도
 * - 서버 응답 body가 없을 수도 있는 상황을 고려해 JSON 파싱 시 try/catch
 * - 서버가 내려준 { message: string } 형태의 에러 메시지를 우선 사용
 */
async function apiCall<T = unknown>(
    endpoint: string,
    method: HttpMethod = "GET",
    body?: unknown,
    options: ApiOptions = {},
): Promise<T> {
    const { useJWT = false, headers = {}, params, useCredentials = true } = options

    // endpoint + 쿼리 스트링까지 합친 최종 URL
    const url = `${API_BASE_URL}${endpoint}${buildQueryString(params)}`

    // fetch 설정
    const config: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        credentials: useCredentials ? "include" : "same-origin",
    }

    // JWT 사용 시 Authorization 헤더 추가
    if (useJWT) {
        const token = localStorage.getItem("accessToken")
        if (token) {
            config.headers = {
                Authorization: `Bearer ${token}`,
                ...config.headers,
            }
        }
    }

    // GET 이외 메서드에 대해서만 body 전송
    if (body && method !== "GET") {
        config.body = JSON.stringify(body)
    }

    const response = await fetch(url, config)

    // 401 이면서 JWT를 사용하는 요청이면: 액세스 토큰 갱신 후 재시도
    if (response.status === 401 && useJWT) {
        try {
            // 이미 다른 요청이 갱신을 시작했다면 그 Promise를 재사용
            if (!refreshPromise) {
                refreshPromise = refreshAccessToken()
            }

            // 갱신 완료까지 대기
            await refreshPromise

            // 갱신된 액세스 토큰으로 Authorization 헤더 재설정
            const newToken = localStorage.getItem("accessToken")
            if (newToken) {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${newToken}`,
                }
            }

            // 원래 요청을 한 번 재시도
            const retryResponse = await fetch(url, config)

            let retryData: T | null = null
            try {
                retryData = (await retryResponse.json()) as T
            } catch {
                // body 가 없는 경우 등: 파싱 실패 시 null 로 처리
                retryData = null as unknown as T
            }

            if (!retryResponse.ok) {
                // 서버에서 { message: string } 형태로 내려준 경우 그 메시지를 사용
                const errorMessage =
                    retryData && typeof retryData === "object" && "message" in retryData
                        ? (retryData as { message: string }).message
                        : "Request Failed"

                throw new Error(errorMessage)
            }

            return retryData
        } catch (refreshError) {
            // 토큰 갱신 자체가 실패한 경우:
            // - 액세스 토큰 제거
            // - 로그인 페이지로 이동
            localStorage.removeItem("accessToken")
            window.location.href = "/login"
            throw refreshError
        } finally {
            // 성공/실패와 상관없이 항상 Promise 초기화
            refreshPromise = null
        }
    }

    // 일반 응답 처리 (401이 아닌 경우)
    let data: T | null = null
    try {
        data = (await response.json()) as T
    } catch {
        // body 가 없는 204 No Content 등의 경우를 위한 방어 코드
        data = null as unknown as T
    }

    if (!response.ok) {
        const errorMessage =
            data && typeof data === "object" && "message" in data
                ? (data as { message: string }).message
                : "Request Failed"

        throw new Error(errorMessage)
    }

    return data
}

// HTTP 메서드 별로 사용하기 쉽게 래핑한 객체
export const api = {
    /**
     * GET 요청
     * - 쿼리 파라미터(params) 지원
     * - JWT / 쿠키 사용 옵션 지원
     */
    get: <T = unknown>(
        endpoint: string,
        options?: {
            useJWT?: boolean
            useCredentials?: boolean
            params?: Record<string, string | number | boolean>
        },
    ) => apiCall<T>(endpoint, "GET", undefined, options),

    /**
     * POST 요청
     */
    post: <T = unknown>(
        endpoint: string,
        body?: unknown,
        options?: { useJWT?: boolean; useCredentials?: boolean },
    ) => apiCall<T>(endpoint, "POST", body, options),

    /**
     * PUT 요청
     */
    put: <T = unknown>(
        endpoint: string,
        body?: unknown,
        options?: { useJWT?: boolean; useCredentials?: boolean },
    ) => apiCall<T>(endpoint, "PUT", body, options),

    /**
     * PATCH 요청
     */
    patch: <T = unknown>(
        endpoint: string,
        body?: unknown,
        options?: { useJWT?: boolean; useCredentials?: boolean },
    ) => apiCall<T>(endpoint, "PATCH", body, options),

    /**
     * DELETE 요청
     */
    delete: <T = unknown>(
        endpoint: string,
        options?: { useJWT?: boolean; useCredentials?: boolean },
    ) => apiCall<T>(endpoint, "DELETE", undefined, options),
}
