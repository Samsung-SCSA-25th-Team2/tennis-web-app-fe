import {useNavigate} from "react-router-dom"

import {useAuth, useProfile} from "@shared/hooks"

import {ProfileView} from '../components/ProfileView'
import {useProfileEdit} from '../hooks/useProfileEdit'

export function Profile() {
    const {userStatus} = useAuth()
    const {profile, isLoading, error} = useProfile(userStatus?.userId)
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
        handleImageChange,
        nicknameValidation
    } = useProfileEdit(profile)

    if (isLoading || !profile) {
        return null
    }

    if (error) {
        navigate("/error")
        return null
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
            nicknameValidation={nicknameValidation}
        />
    )
}
