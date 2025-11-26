import { useState } from "react"

import {useDebounce} from "@shared/hooks"
import { Button, InputText } from "@shared/components/atoms"

import { CourtList } from "@features/match/components/CourtList.tsx"


export function MatchCreate() {
    const [keyword, setKeyword] = useState("서울")
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
                <CourtList keyword={debouncedKeyword} />
            </div>

            <div className='flex-none pt-sm bg-surface'>
                <Button buttonSize={'full'}>넘어가기</Button>
            </div>
        </div>
    )
}