import {useNavigate} from 'react-router-dom'
import {Button} from '@shared/components/atoms/Button'
import {ImgLoader} from '@shared/components/atoms/ImgLoader'

export function NotFoundPage() {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center justify-center h-full p-lg">
            {/* 이미지 */}
            <ImgLoader imgType="404_error" imgSize="full"/>

            {/* 텍스트 */}
            <h1 className="text-heading-h2 text-text-title mb-sm text-center">
                아웃! 🎾
            </h1>
            <p className="text-body text-text-muted mb-lg text-center">
                찾으시는 페이지가 코트 밖으로 나갔어요
            </p>

            {/* 버튼 */}
            <Button
                variant="info"
                buttonSize="full"
                onClick={() => navigate('/')}
            >
                홈으로
            </Button>
        </div>
    )
}