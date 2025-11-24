import {createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom'

import {MobileLayout} from "@shared/layouts"
import type {RouteHandle} from "@shared/types"


// Pages
import {HomePage, ErrorPage} from "@/pages"

// Auth
import {LoginCallbackPage} from "@features/auth"

// Match
import {MatchPage} from "@features/match"

// Chat
import {ChatPage} from "@features/chat"

// Club
import {ClubPage} from "@features/club"

// Profile
import {ProfileCompletePage} from "@features/profile"
import {ProfilePage} from "@features/profile"


const router = createBrowserRouter([
    {
        path: "/",
        element: <MobileLayout/>,
        children: [
            // Pages
            {
                index: true,
                element: <HomePage/>,
                handle: {showHeader: false, showFooter: false} satisfies RouteHandle
            },
            {
                path: "/error",
                element: <ErrorPage/>,
                handle: {showHeader: false, showFooter: false} satisfies RouteHandle
            },

            // Auth
            {
                path: "/auth/callback",
                element: <LoginCallbackPage />,
                handle: {showHeader: false, showFooter: false} satisfies RouteHandle
            },


            // Match
            {
                path: "/match",
                element: <MatchPage/>,
            },

            // Chat
            {
                path: "/chat",
                element: <ChatPage/>,
            },

            // Club
            {
                path: "/club",
                element: <ClubPage/>,
            },

            // Profile
            {
                path: "/profile",
                element: <ProfilePage/>
            },
            {
                path: "/profile-complete",
                element: <Navigate to={"/profile-complete/1"} replace/>,
                handle: {showHeader: false, showFooter: false} satisfies RouteHandle
            },
            {
                path: "/profile-complete/:questionNumber",
                element: <ProfileCompletePage/>,
                handle: {showHeader: false, showFooter: false} satisfies RouteHandle
            },
        ]
    }
])

function App() {
    return <RouterProvider router={router}/>
}

export default App
