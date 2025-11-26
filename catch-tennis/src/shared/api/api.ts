import {apiUrl as API_BASE_URL} from "@shared/types/common.ts"


async function apiCall<T = unknown>(
    endpoint: string,
    method: string = 'GET',
    body?: unknown,
    options: {
        useJWT?: boolean;
        useCredentials?: boolean;
        headers?: Record<string, string>;
        params?: Record<string, string | number | boolean | undefined>;
    } = {}
): Promise<T> {
    const {useJWT = false, useCredentials = false, headers = {}, params} = options

    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        credentials: useCredentials ? 'include' : 'same-origin',
    }

    let url = `${API_BASE_URL}${endpoint}`
    if (params && Object.keys(params).length > 0) {
        const queryString = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                acc[key] = String(value)
                return acc
            }, {} as Record<string, string>)
        ).toString()
        url += `?${queryString}`
    }


    if (useJWT) {
        const token = localStorage.getItem('accessToken')
        if (token) {
            config.headers = {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                ...config.headers
            }
        }
    }

    if (body && method !== 'GET') {
        config.body = JSON.stringify(body)
    }

    const response = await fetch(url, config)
    const data = (await response.json()) as T
    
    if (!response.ok) {
        const errorMessage = (
            data && typeof data === 'object' && 'message' in data
            )
            ? (data as {message: string}).message
            : 'Request Failed'
        
        throw new Error(errorMessage)
    }
    return data
}

export const api = {
    get: <T = unknown>(endpoint: string,
                       options?: { useJWT?: boolean; useCredentials?: boolean; params?: Record<string, string | number | boolean | undefined> }) =>
        apiCall<T>(endpoint, 'GET', undefined, options),

    post: <T = unknown>(endpoint: string, body?: unknown, options?: { useJWT?: boolean; useCredentials?: boolean }) =>
        apiCall<T>(endpoint, 'POST', body, options),

    put: <T = unknown>(endpoint: string, body?: unknown, options?: { useJWT?: boolean; useCredentials?: boolean }) =>
        apiCall<T>(endpoint, 'PUT', body, options),

    patch: <T = unknown>(endpoint: string, body?: unknown, options?: { useJWT?: boolean; useCredentials?: boolean }) =>
        apiCall<T>(endpoint, 'PATCH', body, options),

    delete: <T = unknown>(endpoint: string, options?: { useJWT?: boolean; useCredentials?: boolean }) =>
        apiCall<T>(endpoint, 'DELETE', undefined, options),
}
