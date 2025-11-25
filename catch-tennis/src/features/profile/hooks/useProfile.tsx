import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {getAuthStatus} from '@features/auth/api/authApi'
import {getProfile} from '../api/profileApi'
import type {ProfileData} from '../common'

export function useProfile() {
    const navigate = useNavigate()
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true)
                console.log('Fetching auth status...')
                // 먼저 auth status로 userId를 얻음
                const authStatus = await getAuthStatus()
                console.log('Auth status:', authStatus)

                // userId로 프로필 조회
                console.log('Fetching profile for userId:', authStatus.userId)
                const data = await getProfile(authStatus.userId)
                console.log('Profile data:', data)

                setProfile(data)
                setError(null)
            } catch (err) {
                console.error('Profile fetch error:', err)
                setError('프로필을 불러오는데 실패했습니다')
                // 에러 페이지로 이동하지 않고 에러 상태만 표시
                // navigate('/error')
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [navigate])

    return {
        profile,
        isLoading,
        error
    }
}