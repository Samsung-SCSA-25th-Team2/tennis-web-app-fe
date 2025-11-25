import {useRef} from 'react'

import {ImgLoader} from '@shared/components/atoms/ImgLoader'

import {useProfile} from '../hooks/useProfile'
import {useProfileEdit} from '../hooks/useProfileEdit'

export function Profile() {
    const {profile, isLoading, error} = useProfile()
    const fileInputRef = useRef<HTMLInputElement>(null)

    console.log('Profile component render:', {profile, isLoading, error})

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

    console.log('EditedProfile:', editedProfile)

    const handleImageClick = () => {
        if (isEditing && fileInputRef.current) {
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

    if (!profile || !editedProfile) {
        console.log('No profile or editedProfile:', {profile, editedProfile})
        return (
            <div className="flex flex-col items-center justify-center h-full p-lg">
                <p className="text-body text-text-muted mb-md">프로필 정보가 없습니다</p>
                {error && (
                    <p className="text-body text-error mb-md">{error}</p>
                )}
                <div className="text-caption text-text-muted text-center">
                    <p>profile: {profile ? 'exists' : 'null'}</p>
                    <p>editedProfile: {editedProfile ? 'exists' : 'null'}</p>
                    <p>브라우저 콘솔을 확인해주세요</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-background">
            <div className="flex-1 overflow-y-auto pb-4">
                {/* 프로필 헤더 - 상단 배경 영역 */}
                <div className="bg-primary pt-8 pb-24 px-4 relative">
                    {/* 우측 상단 수정하기 버튼 */}
                    {!isEditing ? (
                        <button
                            onClick={handleEdit}
                            className="absolute top-4 right-4 text-sm text-text-body bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-md transition-all z-10"
                        >
                            프로필 수정
                        </button>
                    ) : (
                        <div className="absolute top-4 right-4 flex gap-2 z-10">
                            <button
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="text-sm text-text-body bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-md transition-all disabled:opacity-50"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="text-sm text-text-body bg-white bg-opacity-30 hover:bg-opacity-40 px-3 py-1.5 rounded-md transition-all disabled:opacity-50 font-medium"
                            >
                                {isSaving ? '저장 중...' : '저장'}
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col items-center">
                        {/* 프로필 이미지 */}
                        <div className="relative mb-3">
                            <div
                                className={`w-28 h-28 rounded-full overflow-hidden border-4 border-surface shadow-lg ${isEditing ? 'cursor-pointer' : ''}`}
                                onClick={handleImageClick}
                            >
                                {editedProfile.imgUrl ? (
                                    <img
                                        src={editedProfile.imgUrl}
                                        alt={editedProfile.nickname}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-surface flex items-center justify-center">
                                        <span className="text-4xl text-text-title font-bold">
                                            {editedProfile.nickname.charAt(0)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {isEditing && (
                                <div className="absolute bottom-0 right-0 bg-primary rounded-full p-2 shadow-md border-2 border-surface">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-surface"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
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
                                {isEditing ? (
                                    <div className="grid grid-cols-4 gap-2">
                                        <button
                                            onClick={() => updateField('period', 'ONE_YEAR')}
                                            className={`py-2 px-3 text-sm rounded-md transition-colors ${
                                                editedProfile.period === 'ONE_YEAR'
                                                    ? 'bg-primary text-white'
                                                    : 'bg-background text-text-muted border border-border'
                                            }`}
                                        >
                                            1년
                                        </button>
                                        <button
                                            onClick={() => updateField('period', 'TWO_YEARS')}
                                            className={`py-2 px-3 text-sm rounded-md transition-colors ${
                                                editedProfile.period === 'TWO_YEARS'
                                                    ? 'bg-primary text-white'
                                                    : 'bg-background text-text-muted border border-border'
                                            }`}
                                        >
                                            2년
                                        </button>
                                        <button
                                            onClick={() => updateField('period', 'THREE_YEARS')}
                                            className={`py-2 px-3 text-sm rounded-md transition-colors ${
                                                editedProfile.period === 'THREE_YEARS'
                                                    ? 'bg-primary text-white'
                                                    : 'bg-background text-text-muted border border-border'
                                            }`}
                                        >
                                            3년
                                        </button>
                                        <button
                                            onClick={() => updateField('period', 'OVER_FOUR_YEARS')}
                                            className={`py-2 px-3 text-sm rounded-md transition-colors ${
                                                editedProfile.period === 'OVER_FOUR_YEARS'
                                                    ? 'bg-primary text-white'
                                                    : 'bg-background text-text-muted border border-border'
                                            }`}
                                        >
                                            4년+
                                        </button>
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
                                {isEditing ? (
                                    <div className="grid grid-cols-4 gap-2">
                                        <button
                                            onClick={() => updateField('age', 'TWENTY')}
                                            className={`py-2 px-3 text-sm rounded-md transition-colors ${
                                                editedProfile.age === 'TWENTY'
                                                    ? 'bg-primary text-white'
                                                    : 'bg-background text-text-muted border border-border'
                                            }`}
                                        >
                                            20대
                                        </button>
                                        <button
                                            onClick={() => updateField('age', 'THIRTY')}
                                            className={`py-2 px-3 text-sm rounded-md transition-colors ${
                                                editedProfile.age === 'THIRTY'
                                                    ? 'bg-primary text-white'
                                                    : 'bg-background text-text-muted border border-border'
                                            }`}
                                        >
                                            30대
                                        </button>
                                        <button
                                            onClick={() => updateField('age', 'FORTY')}
                                            className={`py-2 px-3 text-sm rounded-md transition-colors ${
                                                editedProfile.age === 'FORTY'
                                                    ? 'bg-primary text-white'
                                                    : 'bg-background text-text-muted border border-border'
                                            }`}
                                        >
                                            40대
                                        </button>
                                        <button
                                            onClick={() => updateField('age', 'OVER_FIFTY')}
                                            className={`py-2 px-3 text-sm rounded-md transition-colors ${
                                                editedProfile.age === 'OVER_FIFTY'
                                                    ? 'bg-primary text-white'
                                                    : 'bg-background text-text-muted border border-border'
                                            }`}
                                        >
                                            50대+
                                        </button>
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
                                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
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
                                                    <svg key={star} className="w-3 h-3 text-border" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
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

                {/* 회원 탈퇴 버튼 - 수정 모드일 때만 표시 */}
                {isEditing && (
                    <div className="mt-8 pb-8 px-4 flex justify-center">
                        <button
                            onClick={handleDelete}
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
