import {useNavigate} from "react-router-dom"
import {useRef} from "react"
import {useAuth, useProfile} from "@shared/hooks"
import {ProfileView} from '../components/ProfileView'
import {useProfileEdit} from '../hooks/useProfileEdit'
import {logout} from "@shared/api/authApi"

export function Profile() {
    const {userStatus, clearUser} = useAuth()
    const {profile, isLoading, error} = useProfile(userStatus?.userId)
    const navigate = useNavigate()
    const scrollContainerRef = useRef<HTMLDivElement>(null)

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

    const handleLogout = async () => {
        try {
            await logout()
        } catch (e) {
            console.error("Logout failed", e)
        } finally {
            clearUser()
            navigate('/login')
        }
    }

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
            onLogout={handleLogout}
            onImageChange={handleImageChange}
            onFieldUpdate={updateField}
            nicknameValidation={nicknameValidation}
            scrollContainerRef={scrollContainerRef}
        />
    )
}
