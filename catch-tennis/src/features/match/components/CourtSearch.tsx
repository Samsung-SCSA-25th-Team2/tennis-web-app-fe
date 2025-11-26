import {useState} from "react"
import {useDebounce} from "@shared/hooks"
import {InputText} from "@shared/components/atoms"
import {CourtSelect} from "@features/match/components/CourtSelect.tsx"

interface CourtSearchProps {
    courtId: string | null
    onCourtIdChange: (courtId: string) => void
}

export function CourtSearch({
    courtId,
    onCourtIdChange
                            }: CourtSearchProps) {

    const [keyword, setKeyword] = useState("")
    const debouncedKeyword = useDebounce(keyword, 750)

    return (
        <div className='flex flex-col overflow-hidden'>
            <div className='flex flex-col flex-none gap-sm p-md'>
                <div className='text-heading-h2'>테니스장을 선택해 주세요</div>
                <InputText
                    inputSize={'big'}
                    onChange={(e)=>{setKeyword(e.target.value)}}
                    placeholder={'예시: 서울, 과천, ...'}
                    autoFocus={true}
                />
            </div>

            <div className='flex-1 overflow-y-auto min-h-0 scrollbar-hide'>
                <CourtSelect
                    keyword={debouncedKeyword}
                    selected={courtId}
                    onCourtIdChange={onCourtIdChange}
                />
            </div>
        </div>
    )
}