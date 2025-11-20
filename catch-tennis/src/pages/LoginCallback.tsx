import {useState, useEffect} from "react"
import {useNavigate, useSearchParams} from "react-router-dom"
import api from "../api/api.ts"

interface UserStatus {
    isProfileComplete: boolean;
}

const LoginCallback = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        const checkUserProfile = async () => {
            const token = searchParams.get('accessToken')

            if (!token) {
                navigate('/login/error', {replace:true})
                return
            }

            try {
                localStorage.setItem('accessToken', token)

                const { isProfileComplete }: UserStatus = await api.get('/v1/auth/status', {useJWT: true})

                if (isProfileComplete) {
                    navigate('/match', {replace: true})
                } else {
                    navigate('/profile-complete', {replace: true})
                }
            } catch (error) {
                console.log(`Error at login callback: ${error}`)
                navigate('/login/error', {replace: true})
            } finally {
                setChecking(false)
            }
        }

        checkUserProfile()

    }, [searchParams, navigate])

    if (checking) {
        return <>Login...</>
    } else {
        return null
    }
}

export default LoginCallback