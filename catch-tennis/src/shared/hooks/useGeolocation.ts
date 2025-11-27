import { useState, useEffect, useCallback, useRef } from 'react'

const STORAGE_KEY = 'catch_tennis_user_location'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export interface GeolocationCoordinates {
    latitude: number
    longitude: number
}

export interface GeolocationState {
    coordinates: GeolocationCoordinates | null
    error: string | null
    loading: boolean
    permission: PermissionState | null
    isCached: boolean
}

export interface UseGeolocationReturn extends GeolocationState {
    requestLocation: (forceRefresh?: boolean) => Promise<void>
    clearError: () => void
    hasLocation: boolean
}

interface CachedLocation {
    latitude: number
    longitude: number
    timestamp: number
}

export const useGeolocation = (): UseGeolocationReturn => {
    const [state, setState] = useState<GeolocationState>({
        coordinates: null,
        error: null,
        loading: false,
        permission: null,
        isCached: false,
    })
    const requestIdRef = useRef(0)

    // Load cache on mount
    useEffect(() => {
        try {
            const cached = localStorage.getItem(STORAGE_KEY)
            if (cached) {
                const data: CachedLocation = JSON.parse(cached)
                const isExpired = Date.now() - data.timestamp > CACHE_DURATION

                if (!isExpired) {
                    setState((prev) => ({
                        ...prev,
                        coordinates: { latitude: data.latitude, longitude: data.longitude },
                        isCached: true,
                    }))
                } else {
                    localStorage.removeItem(STORAGE_KEY)
                }
            }
        } catch (error) {
            console.error(error)
            localStorage.removeItem(STORAGE_KEY)
        }
    }, [])

    // Track permission state
    useEffect(() => {
        if (!('permissions' in navigator)) return

        let permissionStatus: PermissionStatus | null = null

        navigator.permissions
            .query({ name: 'geolocation' })
            .then((result) => {
                permissionStatus = result
                setState((prev) => ({ ...prev, permission: result.state }))

                const handleChange = () => {
                    setState((prev) => ({ ...prev, permission: result.state }))
                }
                result.addEventListener('change', handleChange)
            })
            .catch(() => {})

        return () => {
            if (permissionStatus) {
                permissionStatus.removeEventListener('change', () => {})
            }
        }
    }, [])

    const requestLocation = useCallback(
        async (forceRefresh = false): Promise<void> => {
            if (!navigator.geolocation) {
                setState((prev) => ({
                    ...prev,
                    error: '위치 서비스를 지원하지 않는 브라우저입니다.',
                }))
                return
            }

            // Use cache if available and not forcing refresh
            if (!forceRefresh && state.coordinates && state.isCached) {
                return
            }

            const currentRequestId = ++requestIdRef.current
            setState((prev) => ({ ...prev, loading: true, error: null }))

            return new Promise<void>((resolve) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        if (currentRequestId !== requestIdRef.current) {
                            resolve()
                            return
                        }

                        const coordinates = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        }

                        setState({
                            coordinates,
                            error: null,
                            loading: false,
                            permission: 'granted',
                            isCached: false,
                        })

                        // Save to cache
                        try {
                            localStorage.setItem(
                                STORAGE_KEY,
                                JSON.stringify({
                                    latitude: coordinates.latitude,
                                    longitude: coordinates.longitude,
                                    timestamp: Date.now(),
                                })
                            )
                        } catch (error) {
                            console.error('Failed to cache location:', error)
                        }

                        resolve()
                    },
                    (error) => {
                        if (currentRequestId !== requestIdRef.current) {
                            resolve()
                            return
                        }

                        let errorMessage = '위치 정보를 가져올 수 없습니다.'
                        let permissionState: PermissionState | null = null

                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                errorMessage =
                                    '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.'
                                permissionState = 'denied'
                                break
                            case error.POSITION_UNAVAILABLE:
                                errorMessage = '위치 정보를 사용할 수 없습니다.'
                                break
                            case error.TIMEOUT:
                                errorMessage = '위치 정보 요청 시간이 초과되었습니다.'
                                break
                        }

                        setState((prev) => ({
                            ...prev,
                            error: errorMessage,
                            loading: false,
                            ...(permissionState && { permission: permissionState }),
                        }))

                        resolve()
                    },
                    {
                        enableHighAccuracy: false,
                        timeout: 10000,
                        maximumAge: 0,
                    }
                )
            })
        },
        [state.coordinates, state.isCached]
    )

    const clearError = useCallback(() => {
        setState((prev) => ({ ...prev, error: null }))
    }, [])

    return {
        ...state,
        requestLocation,
        clearError,
        hasLocation: state.coordinates !== null,
    }
}