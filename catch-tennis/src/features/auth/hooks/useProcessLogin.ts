import {useEffect, useState, useRef} from "react"
import {useNavigate, useSearchParams} from "react-router-dom"

import {getAuthStatus} from "@shared/api/authApi"

export function useProcessLogin() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const [isProcessing, setIsProcessing] = useState(true)

    const runOnce = useRef(false)

    useEffect(() => {
        if (runOnce.current) return
        runOnce.current = true

        const process = async () => {
            const token = searchParams.get("accessToken")

            if (!token) {
                navigate("/login/error", {replace:true})
                return
            }
            localStorage.setItem("accessToken", token)

            try {
                const { isProfileComplete } = await getAuthStatus() as { isProfileComplete: boolean }

                if (isProfileComplete) {
                    navigate("/match", {replace:true})
                } else {
                    navigate("/profile-complete", {replace:true})
                }
            } catch (error) {
                console.error('LoginCallbackError:', error)
                navigate("/error", {replace:true})
            } finally {
                setIsProcessing(false)
            }
        }

        process()
    }, [searchParams, navigate])

    return { isProcessing }
}