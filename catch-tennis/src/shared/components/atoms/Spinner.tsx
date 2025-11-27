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

export interface SpinnerProps {
    /** 스피너 크기 */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    /** 스피너 색상 변형 */
    variant?: 'primary' | 'surface' | 'white'
    /** 추가 CSS 클래스 */
    className?: string
}

export function Spinner({
    size = 'md',
    variant = 'primary',
    className = ''
}: SpinnerProps) {
    const sizeStyles = {
        xs: 'h-3 w-3 border',
        sm: 'h-5 w-5 border-2',
        md: 'h-8 w-8 border-2',
        lg: 'h-12 w-12 border-[3px]',
        xl: 'h-16 w-16 border-4'
    }

    const variantStyles = {
        primary: 'border-primary border-t-transparent',
        surface: 'border-surface border-t-transparent',
        white: 'border-white border-t-transparent'
    }

    return (
        <div
            className={`
                animate-spin
                rounded-full
                ${sizeStyles[size]}
                ${variantStyles[variant]}
                ${className}
            `}
            role="status"
            aria-label="로딩 중"
        >
            <span className="sr-only">로딩 중...</span>
        </div>
    )
}
