import type {HTMLAttributes} from "react"

import MatchIcon from '@assets/icons/match.svg?react'
import ChatIcon from '@assets/icons/chat.svg?react'
import ClubIcon from '@assets/icons/club.svg?react'
import ProfileIcon from '@assets/icons/profile.svg?react'

export type IconType = 'match' | 'chat' | 'club' | 'profile'

interface IconLoaderProps extends HTMLAttributes<SVGSVGElement> {
    name: IconType
}

export function IconLoader ({
    name,
    className = '',
    ...rest

                                   }:IconLoaderProps)  {
    const icons = {
        match: MatchIcon,
        chat: ChatIcon,
        club: ClubIcon,
        profile: ProfileIcon,
    }

    const Icon = icons[name]

    return (
        <Icon className={`w-lg h-lg ${className}`} {...rest}/>
    )
}
