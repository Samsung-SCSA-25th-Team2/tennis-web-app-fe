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
        <footer className="sticky bottom-0 z-50 border-t border-border/60 bg-surface/95 px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur">
            <nav className="mx-auto flex max-w-[480px] items-center justify-between gap-4">
                {navElems.map((navElem) => {
                    const active = isActive(navElem.dest)

                    return (
                        <button
                            type="button"
                            className="flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-1 text-xs font-medium transition-all"
                            onClick={() => {navigate(`${navElem.dest}`)}}
                            key={navElem.imgType}
                            aria-current={active ? 'page' : undefined}
                        >
                            <span className={`flex h-11 w-full items-center justify-center rounded-2xl border text-text-muted transition-colors ${active ? 'border-primary/40 bg-primary/10 text-primary' : 'border-transparent hover:text-text-title'}`}>
                                <IconLoader
                                    name={navElem.imgType}
                                    className={`${active ? 'text-primary' : 'text-current'} transition-colors`}
                                />
                            </span>
                            <span className={`text-[11px] ${active ? 'text-text-title' : 'text-text-muted'}`}>
                                {navElem.label}
                            </span>
                            {active && <span className="h-1 w-1 rounded-full bg-primary"/>}
                        </button>
                    )
                })}
            </nav>
        </footer>
    )
}
