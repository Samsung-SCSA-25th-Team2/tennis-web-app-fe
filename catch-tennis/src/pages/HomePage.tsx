import {ImgLoader, Logo} from "@shared/components/atoms"
import {loginUrl as LOGIN_URL} from "@shared/types/common.ts"

export function HomePage() {
    return (
        <>
            <br/><br/><br/><br/>
            <Logo size="full" />
            <a href={LOGIN_URL}>
                <ImgLoader imgType={'login'} imgSize={'full'}/>
            </a>
        </>
    )
}
