import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {getProfile} from '@features/profile/api/profileApi.ts'
import type {ProfileData} from '@features/profile/common.ts'

export function useProfile(userId: number | string | undefined) {
    const navigate = useNavigate()
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)


    useEffect(() => {
        if (userId === undefined) {
            return
        }

        const fetchProfile = async () => {
            try {
                setIsLoading(true)
                const data = await getProfile(userId)

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
    }, [navigate, userId])

    return {
        profile,
        isLoading,
        error
    }
}