import {useNavigate} from "react-router-dom"

import {useAuth, useProfile} from "@shared/hooks"

import {ProfileView} from '../components/ProfileView'
import {useProfileEdit} from '../hooks/useProfileEdit'

export function Profile() {
    const {userStatus, isLoading, error} = useAuth()
    const {profile, isProfileLoading, profileError} = useProfile(userStatus?.userId)
    const navigate = useNavigate()

    const {
        isEditing,
        isSaving,
        isDeleting,
        editedProfile,
        handleEdit,
        handleCancel,
        handleSave,
        handleDelete,
        updateField,
        handleImageChange
    } = useProfileEdit(profile)

    if (!profile || isProfileLoading ) {
        return null
    }

    if (profileError){
        navigate("/error")
    }

    return (
        <ProfileView
            profile={profile}
            isLoading={isLoading}
            error={error}
            isEditing={isEditing}
            isSaving={isSaving}
            isDeleting={isDeleting}
            editedProfile={editedProfile}
            isOwner={true}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onSave={handleSave}
            onDelete={handleDelete}
            onImageChange={handleImageChange}
            onFieldUpdate={updateField}
        />
    )
}
