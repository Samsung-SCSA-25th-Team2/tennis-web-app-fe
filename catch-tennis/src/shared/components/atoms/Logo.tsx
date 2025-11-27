import LogoImg from '@assets/images/logo.png'

/**
 * Logo 컴포넌트
 *
 * 애플리케이션 로고를 표시하는 통일된 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <Logo size="sm" />
 * <Logo size="md" withText />
 * <Logo size="lg" withText textPosition="right" />
 * ```
 */

export interface LogoProps {
    /** 로고 크기 */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
    /** 텍스트 표시 여부 */
    withText?: boolean
    /** 텍스트 위치 */
    textPosition?: 'bottom' | 'right'
    /** 추가 CSS 클래스 */
    className?: string
    /** 이미지 추가 속성 */
    imgProps?: React.ImgHTMLAttributes<HTMLImageElement>
}

export function Logo({
    size = 'md',
    withText = false,
    textPosition = 'right',
    className = '',
    imgProps = {}
}: LogoProps) {
    const sizeStyles = {
        xs: 'w-6 h-6',
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24',
        full: 'w-full h-auto'
    }

    const textSizeStyles = {
        xs: 'text-sm',
        sm: 'text-base',
        md: 'text-lg',
        lg: 'text-xl',
        xl: 'text-2xl',
        full: 'text-2xl'
    }

    const containerStyles = withText
        ? textPosition === 'right'
            ? 'flex items-center gap-2'
            : 'flex flex-col items-center gap-1'
        : ''

    return (
        <div className={`${containerStyles} ${className}`}>
            <img
                src={LogoImg}
                alt="캐치 테니스 로고"
                className={`${sizeStyles[size]} rounded-sm object-contain`}
                {...imgProps}
            />
            {withText && (
                <span className={`${textSizeStyles["full"]} text-text-title font-bold`}>
                    캐치 테니스
                </span>
            )}
        </div>
    )
}
