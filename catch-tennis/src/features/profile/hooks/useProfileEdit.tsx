import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import type {ProfileData} from "@shared/types/common.ts"

import {updateProfile, deleteProfile} from '../api/profileApi'
import {uploadProfileImage, validateImageFile} from '../api/imageUpload'

export function useProfileEdit(initialProfile: ProfileData | null) {
    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [editedProfile, setEditedProfile] = useState<ProfileData | null>(initialProfile)
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)

    // initialProfile이 변경되면 editedProfile도 업데이트
    useEffect(() => {
        if (initialProfile) {
            setEditedProfile(initialProfile)
        }
    }, [initialProfile])

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleCancel = () => {
        setEditedProfile(initialProfile)
        setSelectedImageFile(null)
        setIsEditing(false)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && editedProfile) {
            try {
                // 파일 검증
                validateImageFile(file)

                // 파일 저장
                setSelectedImageFile(file)

                // 미리보기를 위해 임시 URL 생성
                const imageUrl = URL.createObjectURL(file)
                setEditedProfile({
                    ...editedProfile,
                    imgUrl: imageUrl
                })
            } catch (error) {
                // 검증 실패 시 사용자에게 알림
                alert(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다')
                // 파일 입력 초기화
                e.target.value = ''
            }
        }
    }

    const handleSave = async () => {
        if (!editedProfile) return

        try {
            setIsSaving(true)

            // 새로운 이미지가 선택된 경우 S3에 업로드
            if (selectedImageFile) {
                try {
                    const uploadedImageUrl = await uploadProfileImage(selectedImageFile)
                    editedProfile.imgUrl = uploadedImageUrl
                } catch (error) {
                    console.error('Image upload error:', error)
                    const errorMessage = error instanceof Error ? error.message : '이미지 업로드에 실패했습니다'
                    alert(`${errorMessage}\n기존 이미지를 유지합니다.`)
                    // 이미지 업로드 실패 시 기존 이미지 유지
                    editedProfile.imgUrl = initialProfile?.imgUrl || ''
                }
            }

            // 프로필 업데이트
            await updateProfile(editedProfile)
            setIsEditing(false)
            setSelectedImageFile(null)
            window.location.reload()
        } catch (error) {
            console.error('Profile update error:', error)
            alert('프로필 업데이트에 실패했습니다. 다시 시도해주세요.')
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            return
        }

        try {
            setIsDeleting(true)
            await deleteProfile()
            navigate('/')
        } catch (error) {
            console.error('Profile delete error:', error)
            navigate('/error')
        } finally {
            setIsDeleting(false)
        }
    }

    const updateField = (field: keyof ProfileData, value: string) => {
        if (!editedProfile) return
        setEditedProfile({
            ...editedProfile,
            [field]: value
        })
    }

    return {
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
    }
}