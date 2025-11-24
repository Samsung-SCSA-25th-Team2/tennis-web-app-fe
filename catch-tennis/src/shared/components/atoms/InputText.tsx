import type { InputHTMLAttributes} from "react"

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
    inputSize: 'big';
}

export function InputText({
                                      inputSize = 'big',
                                      ...rest

                                  }: InputTextProps) {
    const baseStyles = 'p-md rounded-sm bg-surface-raised border-sm border-border text-heading-h4'
    const sizeStyles = {
        big: 'w-full'
    }

    const styles = `${baseStyles} ${sizeStyles[inputSize]}`

    // TODO: add validation rules
    return (
        <input className={styles} {...rest}/>
    )
}