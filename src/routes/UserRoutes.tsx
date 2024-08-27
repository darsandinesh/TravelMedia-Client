import { Routes, Route } from "react-router-dom"
import LoginPage from "../pages/User/LoginPage"
import UserSignup from "../components/User/Auth/UserSignup/UserSignup"
import OTP from "../components/User/Auth/OTP/OTP"
import HomePage from "../pages/User/HomePage"
import Spinner from "../components/Spinner/Spinner"
import UserProfile from "../pages/User/userProfilePage"
import ErrorPage from "../components/User/404/ErrorPage"
import AddNewPost from "../pages/User/AddNewPost"

function UserRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/Signup" element={<UserSignup />} />
            <Route path="/otp" element={<OTP />} />
            <Route path='/home' element={<HomePage />} />
            <Route path='/spinner' element={<Spinner />} />
            <Route path='/userProfile' element={<UserProfile />} />
            <Route path='/addNewPost' element={<AddNewPost />} />
            <Route path='*' element={<ErrorPage />} />
        </Routes>
    )
}

export default UserRoutes
