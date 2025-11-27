/**
 * Spinner 컴포넌트
 *
 * 로딩 상태를 나타내는 통일된 스피너 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <Spinner size="sm" />
 * <Spinner size="md" variant="primary" />
 * <Spinner size="lg" variant="surface" />
 * ```
 */

import LoadingImg from '@assets/images/loading.png'

export interface SpinnerProps {
    /** 스피너 크기 */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    /** 추가 CSS 클래스 */
    className?: string
}

export function Spinner({
    size = 'md',
    className = ''
}: SpinnerProps) {
    const sizeStyles = {
        xs: 'h-6 w-6',
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
        xl: 'h-20 w-20'
    }

    return (
        <div
            className={`flex items-center justify-center ${className}`}
            role="status"
            aria-label="로딩 중"
        >
            <img
                src={LoadingImg}
                alt="로딩 중"
                className={`${sizeStyles[size]} animate-spin object-contain`}
            />
        </div>
    )
}
