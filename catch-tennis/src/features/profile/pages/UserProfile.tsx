import {useParams, useNavigate} from 'react-router-dom'

import {useAuth, useProfile} from "@shared/hooks"
import {ImgLoader} from "@shared/components/atoms"

import {ProfileView} from '../components/ProfileView'

export function UserProfile() {
    const navigate = useNavigate()
    const {userId} = useParams<{userId: string}>()
    const {userStatus, isLoading, error} = useAuth()
    const {profile, isLoading: isProfileLoading, error: profileError} = useProfile(userId)

    if (isLoading || isProfileLoading) {
        return <ImgLoader imgType={"loading"} imgSize={'full'}/>
    }
    if (error || profileError) {
        navigate('/error')
        return
    }
    if (userId === userStatus?.userId) {
        navigate('/profile/my', {replace:true})
        return
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
