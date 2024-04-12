import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'react-image-crop/dist/ReactCrop.css'
import './index.css'

// Auth
import Login from './auth/Login'
import Register from './auth/Register'
import AddInfo from './auth/AddInfo'
import ConfirmEmail from './auth/ConfirmEmail'
import ResetPassword from './auth/ResetPassword'
import NewPassword from './auth/NewPassword'
import Logout from './auth/Logout.jsx'
// Pages
import Base from './pages/Base.jsx'
import WildPosts from './pages/WildPosts.jsx'
import WildPeople from './pages/WildPeople.jsx'
import For from './pages/For.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import People from './pages/People.jsx'
import ViewPost from './pages/ViewPost.jsx'

const router = createBrowserRouter([
    // Auth
    {path: '/sign-up', element: <Register />}, 
    {path: '/sign-up/add-info', element: <AddInfo />},
    {path: '/sign-up/confirm-email', element: <ConfirmEmail />}, 
    {path: '/login', element: <Login />},
    {path: '/login/:email', element: <Login />},
    {path: '/login/reset-password', element: <ResetPassword />},
    {path: '/login/reset-password/new-password', element: <NewPassword />},
    {path: '/logout', element: <Logout />},
    // Pages
    {path: '/', element: <Base />, children: [
        {path: '/posts', element: <WildPosts />},
        {path: '/people', element: <WildPeople />},
        {path: '/for/:username', element: <For />},
        {path: '/profile/:username', element: <ProfilePage />},
        {path: '/profile/:username/followers', element: <People followers />},
        {path: '/profile/:username/follows', element: <People follows />},
        {path: '/post/:id', element: <ViewPost />},
    ]}
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
