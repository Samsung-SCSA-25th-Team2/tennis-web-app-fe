import {useEffect, useRef} from "react"

import {useInfiniteCourtList} from "@features/match/hook/useInfiniteCourtList.ts"
import {ImgLoader} from "@shared/components/atoms"
import {CourtCard} from "@shared/components/molecules"

export function CourtList({keyword}: {keyword: string}) {
    
    const {courts, loading, loadingMore, error, hasNext, doLoadMore, isEmpty} = useInfiniteCourtList(keyword)
    const sentinelRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasNext && !loading && !loadingMore) {
                    doLoadMore()
                }
            },
            {threshold: 0.1, rootMargin: '100px'}
        )

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current)
        }
        return (() => {observer.disconnect()})
    }, [hasNext, loading, loadingMore, doLoadMore])

    if (loading) {
        return <ImgLoader imgType={'loading'} imgSize={'full'}/>
    }
    if (error && courts.length === 0) {
        return <ImgLoader imgType={'500_error'} imgSize={'full'} />
    }
    if (isEmpty) {
        return <div className="text-caption">해당하는 코트가 없습니다.</div>
    }

    return (
        <div className="flex flex-1 flex-col gap-sm">
            {courts.map((court, i) => {
                return <CourtCard key={i} courtInfo={court}/>
            })}

            {loadingMore && <span className='text-caption'>로딩중...</span> }
            {hasNext && <div ref={sentinelRef} className='h-1'/>}
            {!hasNext && courts.length > 0 && (
                <span className='text-caption'>모든 코트를 조회했습니다.</span>
            )}
        </div>
    )
}