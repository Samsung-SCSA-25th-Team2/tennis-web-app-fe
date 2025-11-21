import type {HTMLAttributes} from "react"

import MatchIcon from '../../../assets/match.svg?react'
import ChatIcon from '../../../assets/chat.svg?react'
import ClubIcon from '../../../assets/club.svg?react'
import ProfileIcon from '../../../assets/profile.svg?react'

export type IconType = 'match' | 'chat' | 'club' | 'profile'

interface IconLoaderProps extends HTMLAttributes<SVGSVGElement> {
    name: IconType
}

const IconLoader = ({
    name,
    className = '',
    ...rest

                                   }:IconLoaderProps) =>  {
    const icons = {
        match: MatchIcon,
        chat: ChatIcon,
        club: ClubIcon,
        profile: ProfileIcon,
    }

    const Icon = icons[name]

    console.log(`IconLoader className ${className}`)
    return (
        <Icon className={`w-lg h-lg ${className}`} {...rest}/>
    )
}

export default IconLoader