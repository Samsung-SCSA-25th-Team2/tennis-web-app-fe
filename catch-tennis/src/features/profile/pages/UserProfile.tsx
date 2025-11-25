import {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'

import {ProfileView} from '../components/ProfileView'
import {getProfile} from '../api/profileApi'
import type {ProfileData} from '../common'

export function UserProfile() {
    const {userId} = useParams<{userId: string}>()
    const navigate = useNavigate()
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId) {
                navigate('/error')
                return
            }

            try {
                setIsLoading(true)
                const data = await getProfile(Number(userId))
                setProfile(data)
                setError(null)
            } catch (err) {
                console.error('Profile fetch error:', err)
                setError('프로필을 불러오는데 실패했습니다')
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [userId, navigate])

    if (!profile && !isLoading) {
        return null
    }

    return (
        <ProfileView
            profile={profile!}
            isLoading={isLoading}
            error={error}
            isOwner={false}
        />
    )
}
