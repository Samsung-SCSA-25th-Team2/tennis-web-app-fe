import {Outlet, type UIMatch, useMatches} from 'react-router-dom'

import Header from "../components/Header.tsx"
import Footer from "../components/Footer.tsx"
import type {RouteHandle} from "../types/routes.ts"


const MobileLayout = () => {
    const matches = useMatches() as UIMatch<unknown, RouteHandle>[]
    const currentRoute = matches[matches.length - 1]
    const {showHeader = true, showFooter = true} = currentRoute.handle || {}
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
                {showHeader && (<Header />)}
                <main className="
                    flex-1 flex flex-col
                    overflow-y-auto
                    scrollbar-hide
                    min-h-0
                    py-sm
                    px-md
                ">
                    <Outlet/>
                </main>
                {showFooter && (<Footer />)}
            </div>
        </div>
    )
}

export default MobileLayout