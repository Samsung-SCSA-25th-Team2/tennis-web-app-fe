import {useNavigate} from "react-router-dom"

interface NavItem {
    label: string
    imgType: ImgType
    dest: string
}

const Footer = () => {
    const navigate = useNavigate()

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
    return (
        <footer className="
            flex px-xl py-sm
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
                    >
                        <ImgLoader imgType={navElem.imgType} imgSize={'small'}/>
                        <span className="text-caption">{navElem.label}</span>
                    </div>
                ))
            }
        </footer>
    )
}

export default Footer