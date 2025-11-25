import {api} from '@shared/api'

/**
 * S3 이미지 업로드를 위한 Presigned URL 방식
 *
 * 흐름:
 * 1. 백엔드에 Presigned URL 요청
 * 2. 받은 URL로 S3에 직접 업로드
 * 3. 업로드된 이미지 URL을 프로필에 저장
 */

interface PresignedUrlResponse {
    presignedUrl: string
    imageUrl: string
    expirationSeconds: number
}

/**
 * 백엔드에서 S3 Presigned URL 받기
 */
export async function getPresignedUrl(fileName: string, fileType: string): Promise<PresignedUrlResponse> {
    return api.post<PresignedUrlResponse>(
        '/v1/users/me/profile-image/presigned-url',
        {
            fileName,
            fileType
        },
        {useJWT: true}
    )
}

/**
 * 이미지 파일 검증
 */
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function validateImageFile(file: File): void {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
        throw new Error('지원하지 않는 이미지 형식입니다. (JPG, PNG, WebP만 가능)')
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new Error('파일 크기는 5MB를 초과할 수 없습니다')
    }
}

/**
 * S3에 이미지 직접 업로드
 */
export async function uploadToS3(presignedUrl: string, file: File): Promise<void> {
    const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type
        }
    })

    if (!response.ok) {
        throw new Error('S3 업로드 실패')
    }
}

/**
 * 프로필 이미지 업로드 전체 프로세스
 */
export async function uploadProfileImage(file: File): Promise<string> {
    // 1. 파일 검증
    validateImageFile(file)

    // 2. Presigned URL 받기
    const {presignedUrl, imageUrl} = await getPresignedUrl(file.name, file.type)

    // 3. S3에 업로드
    await uploadToS3(presignedUrl, file)

    // 4. 업로드된 이미지 URL 반환
    return imageUrl
}

