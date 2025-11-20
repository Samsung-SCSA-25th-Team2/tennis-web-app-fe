import {createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom'

import type {RouteHandle} from "./shared/types/routes.ts"

import MobileLayout from "./shared/layouts/MobileLayout.tsx"
import Home from "./pages/Home.tsx"
import LoginCallback from "./pages/LoginCallback.tsx"
import ErrorPage from "./pages/ErrorPage.tsx"
import Submit from "./pages/Submit.tsx"
import ProfileCompleteWrapper from "./pages/ProfileCompleteWrapper.tsx"
import Match from "./pages/Match.tsx"
import Chat from "./pages/Chat.tsx"
import Club from "./pages/Club.tsx"
import Profile from "./pages/Profile.tsx"


const router = createBrowserRouter([
    {
        path: "/",
        element: <MobileLayout/>,
        children: [
            {
                index: true,
                element: <Home/>,
                handle: {showHeader: false, showFooter: false} satisfies RouteHandle
            },
            {
                path: "/auth/callback",
                element: <LoginCallback />,
                handle: {showHeader: false, showFooter: false} satisfies RouteHandle
            },
            {
                path: "/error",
                element: <ErrorPage/>,
                handle: {showHeader: false, showFooter: false} satisfies RouteHandle
            },
            {
                path: "/profile-complete",
                element: <Navigate to={"/profile-complete/1"} replace/>,
                handle: {showHeader: false, showFooter: false} satisfies RouteHandle
            },
            {
                path: "/profile-complete/:questionNumber",
                element: <ProfileCompleteWrapper/>,
                handle: {showHeader: false, showFooter: false} satisfies RouteHandle
            },
            {
                path: "/submit",
                element: <Submit/>,
                handle: {showHeader: false, showFooter: false} satisfies RouteHandle
            },
            {
                path: "/match",
                element: <Match/>,
            },
            {
                path: "/chat",
                element: <Chat/>,
            },
            {
                path: "/club",
                element: <Club/>,
            },
            {
                path: "/profile",
                element: <Profile/>
            },
        ]
    }
])

function App() {
    return <RouterProvider router={router}/>
}

export default App
