import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {setHours} from "date-fns"

import {DatePicker, TimePicker} from "@shared/components/atoms"
import {Age, GameType, Period, type TimeRange} from "@shared/types"
import {ToggleGroup, ToggleGroupItem} from "@shared/components/ui/toggle-group.tsx"
import {Stepper} from "@shared/components/molecules"
import {Input} from "@shared/components/ui/input.tsx"
import {Textarea} from "@shared/components/ui/textarea.tsx"
import {Button} from "@shared/components/ui/button"

import {CourtSearch} from "@features/match/components/CourtSearch.tsx"
import {matchCreatePost} from "@features/match/api/matchApi.ts"
import {toISOStringKR} from "@shared/utils/datetimeFormatter.ts"


export function MatchCreate({questionNumber}: { questionNumber: string }) {

    const questionIdx = parseInt(questionNumber) - 1
    const navigate = useNavigate()

    // q1
    const [courtId, setCourtId] = useState<string | null>(null)
    const [date, setDate] = useState(new Date())
    // q2
    const [timeRange, setTimeRange] = useState<TimeRange>({start: 0, end: 24})
    // q3
    const [periods, setPeriods] = useState<Period[]>([])
    const handlePeriodsChange = (values: string[]) => {
        setPeriods(values as Period[])
    }
    // q4
    const [gameType, setGameType] = useState<GameType>()
    const handleGameTypeChange = (value: string) => {
        setGameType(value as GameType)
    }
    // q5
    const [playerCountMen, setPlayerCountMen] = useState<number>(0)
    const [playerCountWomen, setPlayerCountWomen] = useState<number>(0)
    // q6
    const [ageRange, setAgeRange] = useState<Age[]>([])
    const handleAgeRangeChange = (values: string[]) => {
        setAgeRange(values as Age[])
    }
    // q7
    const [fee, setFee] = useState<number | undefined>(undefined)
    // q8
    const [description, setDescription] = useState<string>()


    const elems = [
        <CourtSearch courtId={courtId} onCourtIdChange={setCourtId}/>,
        <div className='flex flex-1 flex-col justify-center items-center max-w-[300px]'>
            <div className='text-heading-h2 text-text-title pb-lg'>날짜와 시간을 선택해 주세요</div>
            <DatePicker mode={'single'} date={date} onDateChange={setDate}/>
            <TimePicker border={false} value={timeRange} onTimeRangeChange={setTimeRange}/>
        </div>,
        <div className='flex flex-1 flex-col justify-center gap-lg'>
            <span className='text-heading-h2 text-text-title text-center'>구력을 설정해 주세요</span>
            <ToggleGroup type={'multiple'} variant={'outline'} spacing={3} size={'lg'}
                         value={periods} onValueChange={handlePeriodsChange}>
                <ToggleGroupItem className='w-15 bg-surface-raised data-[state=on]:bg-primary' value={Period.OneYear}>1년</ToggleGroupItem>
                <ToggleGroupItem className='w-15 bg-surface-raised data-[state=on]:bg-primary' value={Period.TwoYears}>2년</ToggleGroupItem>
                <ToggleGroupItem className='w-15 bg-surface-raised data-[state=on]:bg-primary' value={Period.ThreeYears}>3년</ToggleGroupItem>
                <ToggleGroupItem className='w-15 bg-surface-raised data-[state=on]:bg-primary' value={Period.OverFourYears}>+4년</ToggleGroupItem>
            </ToggleGroup>
        </div>,
        <div className='flex flex-1 flex-col justify-center gap-lg'>
            <span className='text-heading-h2 text-text-title text-center'>게임 유형을 선택해 주세요</span>
            <ToggleGroup type={'single'} variant={'outline'} spacing={3} size={'lg'}
                         value={gameType} onValueChange={handleGameTypeChange}>
                <ToggleGroupItem className='w-15 bg-surface-raised data-[state=on]:bg-primary' value={GameType.Singles}>단식</ToggleGroupItem>
                <ToggleGroupItem className='w-15 bg-surface-raised data-[state=on]:bg-primary' value={GameType.MenDoubles}>남복</ToggleGroupItem>
                <ToggleGroupItem className='w-15 bg-surface-raised data-[state=on]:bg-primary' value={GameType.WomenDoubles}>여복</ToggleGroupItem>
                <ToggleGroupItem className='w-15 bg-surface-raised data-[state=on]:bg-primary' value={GameType.MixedDoubles}>혼복</ToggleGroupItem>
            </ToggleGroup>
        </div>,
        <div className='flex flex-1 w-full flex-col justify-center gap-lg px-lg'>
            <span className='text-heading-h2 text-text-title text-center'>모집 인원을 작성해 주세요</span>
            <Stepper label={'남자'} min={0} max={10} onChange={setPlayerCountMen}/>
            <Stepper label={'여자'} min={0} max={10} onChange={setPlayerCountWomen}/>
        </div>,
        <div className='flex flex-1 flex-col justify-center gap-lg'>
            <div className='flex flex-col'>
                <span className='text-heading-h2 text-text-title text-center'>모집 연령대를 선택해 주세요</span>
                <span className='text-heading-h4 text-center'>-복수선택 가능-</span>
            </div>
            <ToggleGroup type={'multiple'} variant={'outline'} spacing={3} size={'lg'}
                         value={ageRange} onValueChange={handleAgeRangeChange}>
                <ToggleGroupItem className='w-15 bg-surface-raised data-[state=on]:bg-primary' value={Age.Twenty}>20대</ToggleGroupItem>
                <ToggleGroupItem className='w-15 bg-surface-raised data-[state=on]:bg-primary' value={Age.Thirty}>30대</ToggleGroupItem>
                <ToggleGroupItem className='w-15 bg-surface-raised data-[state=on]:bg-primary' value={Age.Forty}>40대</ToggleGroupItem>
                <ToggleGroupItem className='w-15 bg-surface-raised data-[state=on]:bg-primary' value={Age.OverFifty}>+50대</ToggleGroupItem>
            </ToggleGroup>
        </div>,
        <div className='flex flex-1 flex-col justify-center gap-lg'>
            <span className='text-heading-h2 text-text-title text-center'>참가비를 입력해주세요</span>
            <Input className='text-center no-spinner'
                   value={fee} type={'number'} placeholder={'참가비 입력'}
                   onChange={(e)=>{
                       const strVal = e.target.value

                       if (strVal === '') {
                           setFee(undefined)
                           return
                       }

                       const val = parseInt(e.target.value)
                       if (val > 100 * 10000) {
                           return
                       }

                       if (val < 0) {
                           setFee(0)
                           return
                       }

                       setFee(val)
                   }}
            />
        </div>,
        <div className='flex flex-1 flex-col justify-center gap-lg w-full px-xl'>
            <span className='text-heading-h2 text-text-title text-center'>매칭 소개글을 입력해 주세요</span>
            <div>
                <div className='text-right text-caption text-text-muted'>{description ? description.length : 0}/1000</div>
                <Textarea
                    className='field-sizing-fixed resize-none'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={1000}
                    placeholder={'소개글 입력'}
                />
            </div>
        </div>,
    ]

    const activated = () => {
        if (questionIdx === 0 && courtId !== null) {
            return true
        } else if (questionIdx === 1) {
            return true
        } else if (questionIdx === 2 && periods.length > 0) {
            return true
        } else if (questionIdx === 3 && gameType) {
            return true
        } else if (questionIdx === 4 && (playerCountMen + playerCountWomen > 0)) {
            return true
        } else if (questionIdx === 5 && ageRange.length > 0) {
            return true
        } else if (questionIdx === 6 && fee) {
            return true
        } else if (questionIdx === 7 && description?.length) {
            return true
        }
        return false
    }

    const toNextStep = async () => {
        if (questionIdx < elems.length - 1) {
            navigate(`/match/create/${questionIdx + 2}`)
        } else {
            try {
                if (!gameType || !courtId || !fee || !description) {
                    throw new Error('Not Valid Request')
                }

                const startDateTimeString = toISOStringKR(setHours(date, timeRange.start))
                const endDateTimeString = toISOStringKR(setHours(date, timeRange.end))

                const body =
                {
                    startDateTime: startDateTimeString,
                    endDateTime: endDateTimeString,
                    gameType,
                    courtId: parseInt(courtId),
                    period: periods,
                    playerCountMen,
                    playerCountWomen,
                    ageRange,
                    fee,
                    description
                }
                const matchCreateResult = await matchCreatePost(body)
                navigate(`/match/${matchCreateResult.matchId}`, {replace: true})
            } catch (error) {
                console.error(error)
                navigate('/error')
            }


        }
    }

    return (
        <div className='flex flex-1 flex-col overflow-hidden py-lg items-center'>
            {elems[questionIdx]}
            <div className='sticky bottom-0 z-50 flex-none pt-sm bg-surface w-full'>
                <Button
                    className='w-full'
                    variant={activated() ? 'default' : 'outline'}
                    disabled={!activated()}
                    onClick={toNextStep}
                    size={'lg'}
                >{questionIdx === elems.length - 1 ? '제출하기' : '넘어가기'}</Button>
            </div>
        </div>
    )
}