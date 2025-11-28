import HeroBanner from '@assets/images/ad1.png'

export const Header = () => {
    return (
        <header className="
            flex flex-col gap-0
            sticky top-0 z-40 border-b border-border/60 bg-surface/95 px-md py-xs backdrop-blur
            ">
                <div className='flex items-center justify-between'>
                    <span className="text-xs uppercase tracking-[0.3em] text-text-muted">
                        Catch Tennis
                    </span>
                    <span className='text-text-title font-semibold text-heading-h4'>
                        오늘도 함께, 더 가볍게
                    </span>
                </div>

                <div className="relative overflow-hidden rounded-3xl">
                    <img
                        src={HeroBanner}
                        alt="Catch Tennis Highlight"
                        className="h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" aria-hidden/>
                </div>
        </header>
    )
}
