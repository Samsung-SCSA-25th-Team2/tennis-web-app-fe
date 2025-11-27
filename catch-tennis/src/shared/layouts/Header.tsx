import HeroBanner from '@assets/images/ad1.png'

export const Header = () => {
    return (
        <header className="sticky top-0 z-40 space-y-4 border-b border-border/60 bg-surface/95 px-md py-4 backdrop-blur">
            <div className="flex items-center gap-3">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
                        Catch Tennis
                    </p>
                    <h1 className="text-xl font-semibold text-text-title">
                        오늘도 함께, 더 가볍게
                    </h1>
                </div>
            </div>

            <div className="grid gap-4 rounded-3xl border border-border bg-surface shadow-sm md:grid-cols-[1.2fr,0.8fr]">
                <div className="relative overflow-hidden rounded-3xl">
                    <img
                        src={HeroBanner}
                        alt="Catch Tennis Highlight"
                        className="h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" aria-hidden/>
                </div>
            </div>
        </header>
    )
}
