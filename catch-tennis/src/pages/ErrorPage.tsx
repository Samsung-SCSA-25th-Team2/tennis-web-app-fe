import { useNavigate } from 'react-router-dom'
import { Button } from '@shared/components/atoms/Button'
import { ImgLoader } from '@shared/components/atoms/ImgLoader'

export function ErrorPage() {
  const navigate = useNavigate()
    const handleGoHome = () => {
    navigate('/')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-lg bg-surface">
      {/* 이미지 */}
      <div className="mb-lg">
        <ImgLoader imgType="500_error" style={{ width: '300px', height: '300px' }} />
      </div>

      {/* 텍스트 */}
      <h1 className="text-heading-h2 text-text-title mb-sm text-center">
        앗, 문제가 생겼어요
      </h1>
      <p className="text-body text-text-muted mb-lg text-center">
        잠시 후 다시 시도해주세요
      </p>

      {/* 버튼 */}
      <div className="flex flex-col gap-sm w-full max-w-[280px]">
        <Button variant="info" buttonSize="full" onClick={handleGoHome}>
          홈으로
        </Button>
      </div>
    </div>
  )
}
