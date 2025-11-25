import type {ButtonHTMLAttributes} from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'info' | 'inactive';
    buttonSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Button({
                                   variant = 'primary',
                                   buttonSize = 'sm',
                                   children,
                                   className = '',
                                   ...rest
                               }: ButtonProps) {
    const baseStyles = 'rounded-sm border-sm text-heading-h3'

    const variantStyles = {
        primary: 'bg-primary text-text-body border-primary-border',
        info: 'bg-info text-text-title border-info-border',
        inactive: 'bg-surface-muted text-text-muted border-border',
    }

    // TODO: adjust the sizes
    const sizeStyles = {
        xs: 'px-sm py-xs w-[40px] rounded-xl',
        sm: 'px-sm py-xs w-[80px]',
        md: 'px-sm py-xs w-[120px]',
        lg: 'px-sm py-sm w-[180px]',
        xl: 'px-sm py-sm w-[280px]',
        full: 'px-xl py-sm w-full',
    }

    const styles = `${className} ${baseStyles} ${variantStyles[variant]} ${sizeStyles[buttonSize]}`.trim()

    return (
        <button className={styles} {...rest}>
            {children}
        </button>
    )
}
