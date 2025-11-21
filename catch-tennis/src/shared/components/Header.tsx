import {ImgLoader} from "./atoms"

const Header = () => {
    return (
        <header className="flex flex-col p-sm">
            <div className="flex items-center gap-sm">
                <ImgLoader imgType={'logo'} imgSize={'medium'}/>
                <span className="text-heading-h3 text-text-title">캐치 테니스</span>
            </div>
            <div className="w-full h-[3rem] bg-surface-muted">
                여기에 광고
            </div>
        </header>
    )
}

export default Header