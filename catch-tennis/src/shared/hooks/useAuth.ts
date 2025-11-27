import {useEffect, useState, useCallback} from "react"
import {getAuthStatus} from "@shared/api/authApi.js"
import type {UserStatus} from "@shared/types/common.ts"

export function useAuth() {
    const [userStatus, setUserStatus] = useState<UserStatus | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string| null>(null)

    useEffect(() => {
        getAuthStatus()
            .then(userStatus => setUserStatus(userStatus as UserStatus))
            .catch(error => {
                setError(error)
                console.error(`Error at useAuth: ${error.message}`)
            })
            .finally(() => {
                setIsLoading(false)
            })

    }, [])

    const clearUser = useCallback(() => {
        setUserStatus(null)
        localStorage.removeItem('accessToken')
    }, [])

    return {userStatus, isLoading, error, clearUser}
}
