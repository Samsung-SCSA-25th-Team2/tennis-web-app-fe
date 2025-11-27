import {useNavigate} from "react-router-dom"
import {ArrowBigLeftIcon, ArrowLeft, SendToBackIcon} from "lucide-react"


export const HeaderWithBack = () => {
    const navigate = useNavigate()
    return (
        <header>
            <div className="flex items-center gap-3 p-sm">
                <button
                    onClick={() => navigate(-1)}
                    className="text-text-title text-xl hover:opacity-70 transition-opacity"
                >
                    <ArrowLeft/>
                </button>
            </div>

        </header>
    )
}
