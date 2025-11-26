import {createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom'

import {MobileLayout} from "@shared/layouts"
import type {RouteHandle} from "@shared/types"


// Pages
import {HomePage, ErrorPage, NotFoundPage} from "@/pages"

// Auth
import {LoginCallbackPage} from "@features/auth"

// Match
import {MatchPage, MatchDetailPage, MatchCreatePage} from "@features/match"

// Chat
import {ChatPage, ChatRoomPage} from "@features/chat"

// Club
import {ClubPage} from "@features/club"

// Profile
import {ProfileCompletePage, ProfilePage, UserProfilePage} from "@features/profile"


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
            {
                path: "/match/:matchId",
                element: <MatchDetailPage/>,
                handle: {showHeader: false, showFooter: true} satisfies RouteHandle
            },
            {
                path: "/match/create",
                element: <Navigate to={"/match/create/1"} replace/>,
                handle: {showHeader: false, showFooter: false} satisfies RouteHandle
            },
            {
                path: "/match/create/:questionNumber",
                element: <MatchCreatePage/>,
                handle: {showHeader: false, showFooter: false} satisfies RouteHandle
            },

            // Chat
            {
                path: "/chat/my",
                element: <ChatPage/>,
            },
            {
                path: "/chat/:roomId",
                element: <ChatRoomPage/>,
            },

            // Club
            {
                path: "/club",
                element: <ClubPage/>,
            },

            // Profile
            {
                path: "/profile/my",
                element: <ProfilePage/>
            },
            {
                path: "/profile/:userId",
                element: <UserProfilePage/>
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

            // 404 Not Found
            {
                path: "*",
                element: <NotFoundPage/>,
                handle: {showHeader: false, showFooter: false} satisfies RouteHandle
            },
        ]
    }
])

function App() {
    return <RouterProvider router={router}/>
}

export default App
