import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import MobileLayout from "./layouts/MobileLayout.tsx";
import Home from "./pages/home.tsx";
import Profile from "./pages/profile.tsx";

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
            }
        ]
    }
]);

function App() {
    return <RouterProvider router={router}/>;
}

export default App
