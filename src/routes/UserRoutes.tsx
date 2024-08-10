import { Routes, Route } from "react-router-dom"
import LoginPage from "../pages/User/LoginPage"
import UserSignup from "../components/User/Auth/UserSignup/UserSignup"
import OTP from "../components/User/Auth/OTP/OTP"
import HomePage from "../pages/User/HomePage"

function UserRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/Signup" element={<UserSignup />} />
            <Route path="/otp" element={<OTP />} />
            <Route path='/home' element={<HomePage />} />
        </Routes>
    )
}

export default UserRoutes
