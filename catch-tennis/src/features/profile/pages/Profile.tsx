import {ProfileView} from '../components/ProfileView'
import {useProfile} from '../hooks/useProfile'
import {useProfileEdit} from '../hooks/useProfileEdit'

export function Profile() {
    const {profile, isLoading, error} = useProfile()

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

    if (!profile) {
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
        />
    )
}
