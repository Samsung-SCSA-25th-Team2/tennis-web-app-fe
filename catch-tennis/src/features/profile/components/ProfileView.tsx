import {useRef} from 'react'

import {ImgLoader} from '@shared/components/atoms/ImgLoader'
import EditIcon from '@/assets/icons/edit.svg?react'
import StarIcon from '@/assets/icons/star.svg?react'
import type {ProfileData} from "@shared/types/common.ts"

interface ProfileViewProps {
    profile: ProfileData
    isLoading?: boolean
    error?: string | null
    isEditing?: boolean
    isSaving?: boolean
    isDeleting?: boolean
    editedProfile?: ProfileData | null
    isOwner?: boolean
    onEdit?: () => void
    onCancel?: () => void
    onSave?: () => void
    onDelete?: () => void
    onImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onFieldUpdate?: (field: keyof ProfileData, value: string) => void
}

export function ProfileView({
    profile,
    isLoading = false,
    error = null,
    isEditing = false,
    isSaving = false,
    isDeleting = false,
    editedProfile = null,
    isOwner = false,
    onEdit,
    onCancel,
    onSave,
    onDelete,
    onImageChange,
    onFieldUpdate
}: ProfileViewProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const displayProfile = editedProfile || profile

    const handleImageClick = () => {
        if (isEditing && fileInputRef.current && onImageChange) {
            fileInputRef.current.click()
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <ImgLoader imgType="loading" imgSize="full" />
                <p className="text-body text-text-muted mt-md">로딩 중...</p>
            </div>
        )
    }

    if (!profile || !displayProfile) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-lg">
                <p className="text-body text-text-muted mb-md">프로필 정보가 없습니다</p>
                {error && (
                    <p className="text-body text-error mb-md">{error}</p>
                )}
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-background">
            <div className="flex-1 overflow-y-auto pb-4">
                {/* 프로필 헤더 - 상단 배경 영역 */}
                <div className="bg-primary pt-8 pb-24 px-4 relative">
                    {/* 우측 상단 수정하기 버튼 - 본인 프로필일 때만 */}
                    {isOwner && (
                        <>
                            {!isEditing ? (
                                <button
                                    onClick={onEdit}
                                    className="absolute top-4 right-4 text-sm text-text-body bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-md transition-all z-10"
                                >
                                    프로필 수정
                                </button>
                            ) : (
                                <div className="absolute top-4 right-4 flex gap-2 z-10">
                                    <button
                                        onClick={onCancel}
                                        disabled={isSaving}
                                        className="text-sm text-text-body bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-md transition-all disabled:opacity-50"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={onSave}
                                        disabled={isSaving}
                                        className="text-sm text-text-body bg-white bg-opacity-30 hover:bg-opacity-40 px-3 py-1.5 rounded-md transition-all disabled:opacity-50 font-medium"
                                    >
                                        {isSaving ? '저장 중...' : '저장'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    <div className="flex flex-col items-center">
                        {/* 프로필 이미지 */}
                        <div className="relative mb-3">
                            <div
                                className={`w-28 h-28 rounded-full overflow-hidden border-4 border-surface shadow-lg ${isEditing && isOwner ? 'cursor-pointer' : ''}`}
                                onClick={handleImageClick}
                            >
                                {displayProfile.imgUrl ? (
                                    <img
                                        src={displayProfile.imgUrl}
                                        alt={displayProfile.nickname}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-surface flex items-center justify-center">
                                        <span className="text-4xl text-text-title font-bold">
                                            {displayProfile.nickname.charAt(0)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {isEditing && isOwner && (
                                <div className="absolute bottom-0 right-0 bg-primary rounded-full p-2 shadow-md border-2 border-surface">
                                    <EditIcon className="h-5 w-5 text-surface" />
                                </div>
                            )}
                            {isOwner && onImageChange && (
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={onImageChange}
                                    className="hidden"
                                />
                            )}
                        </div>

                        {/* 닉네임 */}
                        <h1 className="text-2xl text-text-title font-bold drop-shadow-md">
                            {profile.nickname}
                        </h1>
                    </div>
                </div>

                {/* 프로필 정보 카드 */}
                <div className="px-4 -mt-12 relative z-20">
                    <div className="bg-surface rounded-lg shadow-md p-5">
                        <div className="flex flex-col gap-6">

                            {/* 테니스 경력 */}
                            <div>
                                <label className="text-sm text-text-muted mb-2 block font-medium">테니스 경력</label>
                                {isEditing && isOwner ? (
                                    <div className="grid grid-cols-4 gap-2">
                                        {[
                                            {value: 'ONE_YEAR', label: '1년'},
                                            {value: 'TWO_YEARS', label: '2년'},
                                            {value: 'THREE_YEARS', label: '3년'},
                                            {value: 'OVER_FOUR_YEARS', label: '4년+'}
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => onFieldUpdate?.('period', option.value)}
                                                className={`py-2 px-3 text-sm rounded-md transition-colors ${
                                                    displayProfile.period === option.value
                                                        ? 'bg-primary text-white'
                                                        : 'bg-background text-text-muted border border-border'
                                                }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-base text-text-title pt-1">
                                        {profile.period === 'ONE_YEAR' && '1년'}
                                        {profile.period === 'TWO_YEARS' && '2년'}
                                        {profile.period === 'THREE_YEARS' && '3년'}
                                        {profile.period === 'OVER_FOUR_YEARS' && '4년 이상'}
                                    </p>
                                )}
                            </div>

                            {/* 성별 */}
                            <div>
                                <label className="text-sm text-text-muted mb-2 block font-medium">성별</label>
                                <p className="text-base text-text-title pt-1">
                                    {profile.gender === 'MALE' ? '남자' : '여자'}
                                </p>
                            </div>

                            {/* 나이 */}
                            <div>
                                <label className="text-sm text-text-muted mb-2 block font-medium">나이</label>
                                {isEditing && isOwner ? (
                                    <div className="grid grid-cols-4 gap-2">
                                        {[
                                            {value: 'TWENTY', label: '20대'},
                                            {value: 'THIRTY', label: '30대'},
                                            {value: 'FORTY', label: '40대'},
                                            {value: 'OVER_FIFTY', label: '50대+'}
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => onFieldUpdate?.('age', option.value)}
                                                className={`py-2 px-3 text-sm rounded-md transition-colors ${
                                                    displayProfile.age === option.value
                                                        ? 'bg-primary text-white'
                                                        : 'bg-background text-text-muted border border-border'
                                                }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-base text-text-title pt-1">
                                        {profile.age === 'TWENTY' && '20대'}
                                        {profile.age === 'THIRTY' && '30대'}
                                        {profile.age === 'FORTY' && '40대'}
                                        {profile.age === 'OVER_FIFTY' && '50대 이상'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 리뷰 섹션 - WIP */}
                <div className="px-4 mt-6">
                    <div className="bg-surface rounded-lg shadow-md p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-text-title">받은 리뷰</h2>
                            <span className="text-sm text-text-muted">0개</span>
                        </div>

                        {/* 평점 요약 */}
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                            <div className="flex items-center gap-1">
                                <StarIcon className="w-6 h-6 text-yellow-400" />
                                <span className="text-2xl font-bold text-text-title">0.0</span>
                            </div>
                            <span className="text-sm text-text-muted">아직 받은 리뷰가 없습니다</span>
                        </div>

                        {/* 리뷰 목록 플레이스홀더 */}
                        <div className="space-y-3">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="p-3 bg-background rounded-lg border border-border opacity-40">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-border"></div>
                                        <div className="flex-1">
                                            <div className="h-3 bg-border rounded w-20 mb-1"></div>
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <StarIcon key={star} className="w-3 h-3 text-border" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-3 bg-border rounded w-full mb-1"></div>
                                    <div className="h-3 bg-border rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>

                        {/* WIP 배지 */}
                        <div className="mt-4 text-center">
                            <span className="inline-block text-xs text-text-muted bg-background px-3 py-1 rounded-full border border-border">
                                Coming Soon
                            </span>
                        </div>
                    </div>
                </div>

                {/* 회원 탈퇴 버튼 - 수정 모드이고 본인일 때만 표시 */}
                {isEditing && isOwner && onDelete && (
                    <div className="mt-8 pb-8 px-4 flex justify-center">
                        <button
                            onClick={onDelete}
                            disabled={isDeleting}
                            className="text-xs text-text-muted hover:text-error transition-colors underline disabled:opacity-50"
                        >
                            {isDeleting ? '삭제 중...' : '회원 탈퇴'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
