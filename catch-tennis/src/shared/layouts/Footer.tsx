import {useNavigate, useLocation} from "react-router-dom"

import {type IconType, IconLoader} from "@shared/components/atoms"


interface NavItem {
    label: string
    imgType: IconType
    dest: string
}

export const Footer = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const navElems: NavItem[] = [
        {
            label: '매칭',
            imgType: 'match',
            dest: '/match'
        },
        {
            label: '채팅',
            imgType: 'chat',
            dest: '/chat/my'
        },
        {
            label: '클럽',
            imgType: 'club',
            dest: '/club'
        },
        {
            label: '프로필',
            imgType: 'profile',
            dest: '/profile/my'
        },
    ]

    const isActive = (dest: string) => {
        const cur = location.pathname.split('/')[1]
        const d = dest.split('/')[1]
        return cur === d
    }

    return (
        <footer className="
            flex px-lg pt-sm pb-0
            border-border border-sm border-b-0
            rounded-t-sm
            justify-around
            items-center
        ">
            {
                navElems.map((navElem) => (
                    <div
                        className="flex flex-col items-center"
                        onClick={() => {navigate(`${navElem.dest}`)}}
                        key={navElem.imgType}
                    >
                        <IconLoader
                            name={navElem.imgType}
                            className={isActive(navElem.dest) ? 'text-text-title' : 'text-text-muted'}
                        />
                        <span
                            className={`text-caption ${isActive(navElem.dest) ? 'text-text-title' : 'text-text-muted'}`}
                        >
                            {navElem.label}
                        </span>
                    </div>
                ))
            }
        </footer>
    )
}
