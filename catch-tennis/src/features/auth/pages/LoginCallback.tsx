import {ImgLoader} from "@shared/components/atoms"

import {useProcessLogin} from "../hooks/useProcessLogin.ts"


export function LoginCallback() {

    const { isProcessing } = useProcessLogin()

    if (isProcessing) {
        return <ImgLoader imgType={"loading"} imgSize={'full'}/>
    } else {
        return null
    }
}
