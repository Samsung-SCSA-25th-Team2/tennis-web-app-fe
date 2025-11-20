import type {ButtonHTMLAttributes} from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'inactive';
    buttonSize: 'small' | 'big';
}

export default function Button({
                                   variant = 'primary',
                                   buttonSize = 'big',
                                   className = '',
                                   children,
                                   ...rest
                               }: ButtonProps) {
    const baseStyles = 'px-sm py-md rounded-sm border-sm text-heading-h3'

    const variantStyles = {
        primary: 'bg-primary text-text-body border-primary-border',
        inactive: 'bg-surface-muted text-text-muted border-border',
    }

    const sizeStyles = {
        small: 'min-w-20',
        big: 'w-full',
    }

    const styles = `${className} ${baseStyles} ${variantStyles[variant]} ${sizeStyles[buttonSize]}`.trim()

    return (
        <button className={styles} {...rest}>
            {children}
        </button>
    )
}
