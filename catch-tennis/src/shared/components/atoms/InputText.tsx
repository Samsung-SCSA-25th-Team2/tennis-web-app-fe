import type { InputHTMLAttributes} from "react"

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
    inputSize: 'big';
}

export default function InputText({
                                      inputSize = 'big',
                                      className = '',
                                      ...rest

                                  }: InputTextProps) {
    // const baseStyles = 'p-md rounded-sm bg-surface-raised border-sm border-border text-heading-h4 text-text-muted';
    const baseStyles = 'p-md rounded-sm bg-surface-raised border-sm border-border text-heading-h4'
    const sizeStyles = {
        big: 'w-full'
    }

    const styles = `${className} ${baseStyles} ${sizeStyles[inputSize]}`

    return (
        <input className={styles} {...rest}/>
    )
}