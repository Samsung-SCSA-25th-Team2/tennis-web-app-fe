import {type HTMLAttributes} from "react"

import type {ProfileData} from "@shared/types/common.ts"
import {ImgLoader} from "@shared/components/atoms"
import {getGenderLabel, getPeriodLabel, getAgeLabel} from "@shared/utils/toLabel.ts"
import {cn} from "@shared/lib/utils.ts"

interface ProfileCardProps extends HTMLAttributes<HTMLDivElement> {
    userProfile: ProfileData
}

export function ProfileCard({
                                userProfile,
                                className,
                                ...props
                            }: ProfileCardProps) {
    const summaryItems = [
        {label: '성별', value: getGenderLabel(userProfile.gender)},
        {label: '실력', value: getPeriodLabel(userProfile.period)},
        {label: '연령대', value: getAgeLabel(userProfile.age)},
    ]

    return (
        <div
            className={cn(
                "flex flex-col gap-6 rounded-3xl border border-border bg-surface p-6 shadow-sm",
                className
            )}
            {...props}
        >
            <div className="flex items-center gap-4">
                <div className="shrink-0 rounded-2xl border border-border bg-surface p-1.5">
                    <ImgLoader imgType={'unknown'} unknownSrc={userProfile.imgUrl} imgSize={'medium'} shape={'square'}/>
                </div>
                <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
                        Match Host
                    </p>
                    <p className="mt-1 text-xl font-semibold text-text-title">
                        {userProfile.nickname}
                    </p>
                    <p className="text-sm text-text-muted">
                        {userProfile.name}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {summaryItems.map((item) => (
                    <div
                        key={item.label}
                        className="rounded-2xl border border-border px-3 py-2 text-center"
                    >
                        <p className="text-[10px] uppercase tracking-wider text-text-muted">
                            {item.label}
                        </p>
                        <p className="text-sm font-medium text-text-title">
                            {item.value}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
