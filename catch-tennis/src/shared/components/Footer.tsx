import {useNavigate, useLocation} from "react-router-dom"

import IconLoader from "./atoms/IconLoader.tsx"
import {type IconType } from "./atoms/IconLoader.tsx"


interface NavItem {
    label: string
    imgType: IconType
    dest: string
}

const Footer = () => {
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
            dest: '/chat'
        },
        {
            label: '클럽',
            imgType: 'club',
            dest: '/club'
        },
        {
            label: '프로필',
            imgType: 'profile',
            dest: '/profile'
        },
    ]

    const isActive = (dest: string) => {
        return location.pathname === dest
    }

    return (
        <footer className="
            flex px-lg pt-sm pb-0
            border-border border-sm border-b-0
            rounded-t-sm
            justify-around
            items-center
        ">
            {/*TODO: add hover, set min size, set active/inactive according to the url, color???*/}
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

export default Footer