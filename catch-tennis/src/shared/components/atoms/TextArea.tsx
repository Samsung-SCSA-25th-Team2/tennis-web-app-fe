import {type TextareaHTMLAttributes} from "react"

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    value: string
    textareaSize: 'full'
    placeholder: string
}

export function Textarea({
    value,
    textareaSize = 'full',
    placeholder = '',
    ...rest
                         }: TextareaProps) {

    const baseStyles = 'p-md rounded-sm bg-surface-raised border-sm border-border resize-none'

    const sizeStyles = {
        full: 'w-full'
    }

    const styles = `${baseStyles} ${sizeStyles[textareaSize]}`

    // TODO: add length validation

    return (
        <div className="flex flex-col w-full">
            <div className="flex justify-end">
                <span>{value.length}/500</span>
            </div>
            <textarea className={styles} rows={4} {...rest}>{placeholder}</textarea>
        </div>
    )

}