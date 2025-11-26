import {ImgLoader} from "@shared/components/atoms"
import {loginUrl as LOGIN_URL} from "@shared/types/common.ts"

export function HomePage() {
    return (
        <>
            <ImgLoader imgType={'logo'} imgSize={'full'}/>
            <a href={LOGIN_URL}>
                <ImgLoader imgType={'login'} imgSize={'full'}/>
            </a>
        </>
    )
}
