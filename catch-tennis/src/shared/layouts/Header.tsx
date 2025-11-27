import {ImgLoader} from "@shared/components/atoms"

export const Header = () => {
    return (
        <header className="flex flex-col p-sm">
            <div className="flex items-center gap-sm">
                <ImgLoader imgType={'logo'} imgSize={'medium'}/>
                <span className="text-heading-h3 text-text-title">캐치 테니스</span>
            </div>
            <div className="w-full bg-surface-muted">
                <ImgLoader imgType={'ad1'} imgSize={'full'}/>
            </div>
        </header>
    )
}
