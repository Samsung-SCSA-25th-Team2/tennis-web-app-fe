import {useLocation, useNavigate} from "react-router-dom"
import {ArrowLeft} from "lucide-react"


export const HeaderWithBack = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const handleBack = () => {
        if (location.state?.from === 'matchCreate') {
            navigate('/match')
        } else if (location.state?.to === 'profileComplete') {
            navigate('/profile')
        } else {
            navigate(-1)
        }
    }

    return (
        <header>
            <div className="flex items-center gap-3 p-sm">
                <button
                    onClick={handleBack}
                    className="text-text-title text-xl hover:opacity-70 transition-opacity"
                >
                    <ArrowLeft/>
                </button>
            </div>

        </header>
    )
}
