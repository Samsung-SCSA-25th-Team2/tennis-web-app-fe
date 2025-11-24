import {useNavigate} from "react-router-dom"

import {Button} from "@shared/components/atoms"

export function CreateMatchButton() {
    const navigate = useNavigate()
    const handleClick = () => {
        navigate('/match-create')
    }
    return (
        <div className="sticky bottom-1 z-50 flex w-full justify-end pointer-events-none">
            <Button
                variant={'primary'}
                buttonSize={'md'}
                className="pointer-events-auto"
                onClick={handleClick}
            >
                글쓰기
            </Button>
        </div>
    )

}