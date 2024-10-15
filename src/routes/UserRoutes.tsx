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
// import ChatPage from "../pages/User/ChatPage"
// import ChatSidebar from "../components/User/Chat/SideBar/ChatSidebar"
import Chat from "../components/User/Chat/Chat"
import SearchPage from "../pages/User/SearchPage"
import ViewPost from "../components/User/Home/ViewPost/ViewPost"
import EditPost from "../components/User/Post/EditPost"


function UserRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/Signup" element={<UserSignup />} />
            <Route path="/otp" element={<OTP />} />
            <Route path='/home' element={<HomePage />} />
            <Route path='/spinner' element={<Spinner />} />
            <Route path='/userProfile' element={<UserProfile />} />
            {/* <Route path='/userProfile/:userId' element={<UserProfile />} /> */}
            <Route path='/search' element={<SearchPage />} />
            <Route path='/add-post' element={<AddNewPost />} />
            <Route path='/find-buddy' element={<TravelPage />} />
            <Route path='/chats' element={<Chat />} />
            {/* <Route path='/chats/:id' element={<Chat />} /> */}
            <Route path="/viewPost" element={<ViewPost />} />
            <Route path="/viewPost/:id/:uId" element={<ViewPost />} />
            <Route path='/editPost' element={<EditPost />} />
            <Route path='*' element={<ErrorPage />} />
        </Routes>
    )
}

export default UserRoutes
