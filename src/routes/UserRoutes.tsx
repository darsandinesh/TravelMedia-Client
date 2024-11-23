import { Routes, Route } from "react-router-dom"
import LoginPage from "../pages/User/LoginPage"
import UserSignup from "../components/User/Auth/UserSignup/UserSignup"
import OTP from "../components/User/Auth/OTP/OTP"
import HomePage from "../pages/User/HomePage"
import Spinner from "../components/Spinner/Spinner"
import UserProfile from "../pages/User/userProfilePage"
import ErrorPage from "../components/User/404/ErrorPage"
import AddNewPost from "../pages/User/AddNewPost"
import TravelPage from "../pages/User/TravelPage"
import Chat from "../components/User/Chat/Chat"
import SearchPage from "../pages/User/SearchPage"
import ViewPost from "../components/User/Home/ViewPost/ViewPost"
import EditPost from "../components/User/Post/EditPost"
import MapComponent from "../components/User/Map/MapComponent"
import SuccessPage from "../components/User/FindBuddy/SuccessPage"
import SettingsPage from "../components/User/UserProfile/Settings"
import LandingPage from "../components/User/LandingPage/LandingPage"
import PublicRoute from "./PublicRouteUser"
import PrivateRouteUser from "./PrivateRouteUser"


function UserRoutes() {
    return (
        <Routes>
            {/* public routes */}
            <Route path="/" element={<PublicRoute><LandingPage /> </PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /> </PublicRoute>} />
            <Route path="/Signup" element={<PublicRoute><UserSignup /> </PublicRoute>} />
            <Route path="/otp" element={<PublicRoute><OTP /> </PublicRoute>} />
            {/* private rotues */}
            <Route path='/home' element={<PrivateRouteUser><HomePage /></PrivateRouteUser>} />
            <Route path='/userProfile' element={<PrivateRouteUser><UserProfile /></PrivateRouteUser>} />
            {/* <Route path='/userProfile/:userId' element={<UserProfile />} /> */}
            <Route path='/search' element={<PrivateRouteUser><SearchPage /></PrivateRouteUser>} />
            <Route path='/add-post' element={<PrivateRouteUser><AddNewPost /></PrivateRouteUser>} />
            <Route path='/find-buddy' element={<PrivateRouteUser><TravelPage /></PrivateRouteUser>} />
            <Route path='/chats' element={<PrivateRouteUser><Chat /></PrivateRouteUser>} />
            {/* <Route path='/chats/:id' element={<Chat />} /> */}
            <Route path="/viewPost" element={<PrivateRouteUser><ViewPost /></PrivateRouteUser>} />
            <Route path="/viewPost/:id/:uId" element={<PrivateRouteUser><ViewPost /></PrivateRouteUser>} />
            <Route path='/editPost' element={<PrivateRouteUser><EditPost /></PrivateRouteUser>} />
            <Route path='/map' element={<PrivateRouteUser><MapComponent /></PrivateRouteUser>} />
            <Route path='/success' element={<PrivateRouteUser><SuccessPage /></PrivateRouteUser>} />
            <Route path='/settings' element={<PrivateRouteUser><SettingsPage /></PrivateRouteUser>} />
            <Route path='/spinner' element={<Spinner />} />
            <Route path='*' element={<ErrorPage />} />

        </Routes>
    )
}

export default UserRoutes
