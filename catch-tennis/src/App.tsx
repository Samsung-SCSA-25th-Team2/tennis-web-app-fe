import {createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom'

import type {RouteHandle} from "./shared/types/routes.ts"

import MobileLayout from "./shared/layouts/MobileLayout.tsx"
import Home from "./shared/pages/Home.tsx"
import Profile from "./shared/pages/Profile.tsx"
import LoginCallback from "./shared/pages/LoginCallback.tsx"
import ErrorPage from "./shared/pages/ErrorPage.tsx"
import Match from "./shared/pages/Match.tsx"
import Submit from "./shared/pages/Submit.tsx"
import ProfileCompleteWrapper from "./shared/pages/ProfileCompleteWrapper.tsx"

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
                path: "profile",
                element: <Profile/>
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
                path: "/match",
                element: <Match/>,
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
            }
        ]
    }
])

function App() {
    return <RouterProvider router={router}/>
}

export default App
