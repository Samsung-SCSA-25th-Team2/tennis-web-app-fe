import {Spinner} from "@shared/components/atoms"

import {useProcessLogin} from "../hooks/useProcessLogin.ts"


export function LoginCallback() {

    const { isProcessing } = useProcessLogin()

    if (isProcessing) {
        return (
            <div className="flex h-full items-center justify-center">
                <Spinner size="xl" />
            </div>
        )
    }

    return null
}
