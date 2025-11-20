import {createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom'

import MobileLayout from "./layouts/MobileLayout.tsx"
import Home from "./pages/Home.tsx"
import Profile from "./pages/Profile.tsx"
import LoginCallback from "./pages/LoginCallback.tsx"
import ErrorPage from "./pages/ErrorPage.tsx"
import Match from "./pages/Match.tsx"
import Submit from "./pages/Submit.tsx"
import ProfileCompleteWrapper from "./pages/ProfileCompleteWrapper.tsx"

const router = createBrowserRouter([
    {
        path: "/",
        element: <MobileLayout/>,
        children: [
            {
                index: true,
                element: <Home/>
            },
            {
                path: "profile",
                element: <Profile/>
            },
            {
                path: "/auth/callback",
                element: <LoginCallback />
            },
            {
                path: "/login/failure",
                element: <ErrorPage/>
            },
            {
                path: "/match",
                element: <Match/>
            },
            {
                path: "/profile-complete",
                element: <Navigate to={"/profile-complete/1"} replace/>
            },
            {
                path: "/profile-complete/:questionNumber",
                element: <ProfileCompleteWrapper/>
            },
            {
                path: "/submit",
                element: <Submit/>
            }
        ]
    }
])

function App() {
    return <RouterProvider router={router}/>
}

export default App
