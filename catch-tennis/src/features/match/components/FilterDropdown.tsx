import {ChevronDown} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@shared/components/ui/dropdown-menu.tsx"
import {Button as ShadcnButton} from "@shared/components/ui/button.tsx"


interface FilterOption<T> {
    value: T
    label: string
}

interface FilterDropdownProps<T extends string> {
    value: T
    options: FilterOption<T>[]
    onChange: (value: T) => void
    placeholder: string
}

export function FilterDropdown<T extends string>({
    value,
    options,
    onChange,
    placeholder,
                                                 }: FilterDropdownProps<T>) {

    const selectedOption = options.find(option => option.value === value)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <ShadcnButton className='w-[30%]'>
                    <span>{selectedOption?.label || placeholder}</span>
                    <ChevronDown className='w-4 h-4'/>
                </ShadcnButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={'center'} className='w-full'>
                <DropdownMenuRadioGroup value={value} onValueChange={(val)=>onChange(val as T)}>
                    {options.map((option) => (
                        <DropdownMenuRadioItem key={option.value} value={option.value}>
                            {option.label}
                        </DropdownMenuRadioItem>
                    ))}

                </DropdownMenuRadioGroup>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}