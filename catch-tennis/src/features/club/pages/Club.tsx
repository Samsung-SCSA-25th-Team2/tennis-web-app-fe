export function Club() {
    const dummyFeatures = [
        {
            title: '동호회 찾기',
            description: '내 실력과 위치에 맞는 테니스 동호회를 찾아보세요',
            icon: '🔍'
        },
        {
            title: '동호회 만들기',
            description: '나만의 테니스 동호회를 만들고 멤버를 모집하세요',
            icon: '➕'
        },
        {
            title: '정기 모임',
            description: '동호회 정기 모임 일정을 관리하고 참여하세요',
            icon: '📅'
        },
        {
            title: '멤버 관리',
            description: '동호회 멤버들과 소통하고 실력을 함께 키워나가세요',
            icon: '👥'
        }
    ]

    return (
        <div className="flex flex-col items-center text-center pt-12 pb-4">
            {/* Coming Soon Section */}
            <div className="mb-6 relative">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
            </div>

            <h2 className="text-2xl font-bold text-text-title mb-2">
                동호회 기능 준비 중
            </h2>
            <p className="text-body text-text-muted">
                더욱 즐거운 테니스 경험을 위해<br />
                동호회 기능을 열심히 만들고 있어요!
            </p>

            <br/>

            {/* Feature List Card - Inspired by ProfileView's review section */}
            <div className="w-full bg-surface rounded-lg shadow-md p-5">
                <div className="space-y-3">
                    {dummyFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className="p-3 bg-background rounded-lg border border-border"
                        >
                            <div className="flex items-start gap-3 text-left">
                                <span className="text-2xl flex-shrink-0 mt-0.5">{feature.icon}</span>
                                <div>
                                    <h4 className="font-semibold text-text-title">
                                        {feature.title}
                                    </h4>
                                    <p className="text-sm text-text-muted">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* WIP Badge */}
                <div className="mt-4 text-center">
                    <span className="inline-block text-xs text-text-muted bg-background px-3 py-1 rounded-full border border-border">
                        Coming Soon
                    </span>
                </div>
            </div>
        </div>
    )
}
