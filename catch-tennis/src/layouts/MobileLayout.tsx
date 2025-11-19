import React from 'react';

interface MobileLayoutProps {
    children: React.ReactNode
}

const MobileLayout = ({children}: MobileLayoutProps) => {
    return (
        <div className="
            flex justify-center items-center
            w-full h-full
            bg-neutral-200
            ">
            <div className="
                flex flex-col relative
                w-full h-full

                sm:w-[480px]
                sm:h-[calc(100dvh-1rem)]
                bg-background shadow-sm
            ">
                <main className="
                    flex-1
                    overflow-y-auto
                    scrollbar-hide
                    min-h-0
                ">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default MobileLayout;