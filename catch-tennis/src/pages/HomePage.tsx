import {ImgLoader} from "@shared/components/atoms"

export function HomePage() {
    return (
        <>
            <ImgLoader imgType={'logo'} imgSize={'full'}/>
            <a href="http://localhost:8888/oauth2/authorization/kakao">
                <ImgLoader imgType={'login'} imgSize={'full'}/>
            </a>
        </>
    )
}
