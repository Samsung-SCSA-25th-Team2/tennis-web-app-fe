import type {SVGProps} from "react"

export type IconName = 'match' | 'chat' | 'club' | 'profile'

interface IconLoaderProps extends SVGProps<SVGSVGElement> {
    name: IconName
}

export default function IconLoader({
    name,
    ...rest

                                   }:IconLoaderProps) {

    const commonProps = {
        width: 24,
        height: 24,
        viewBox: '0 0 24 24',
        fill: 'currentColor',
        ...rest
    }

    switch (name) {
        case 'chat':
            return (
                <svg {...commonProps}></svg>
            )
    }
}

export default IconLoader