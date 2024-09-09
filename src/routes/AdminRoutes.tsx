import { Routes, Route } from 'react-router-dom';
import AdminLogin from '../components/Admin/Auth/AdminLogin/AdminLogin';
import DashboardPage from '../pages/Admin/DashboardPage';
import UserManagementPage from '../pages/Admin/UserManagementPage';

const AdminRoutes = () => {
    return (

        <Routes>
            <Route path='/' element={<AdminLogin />} />
            <Route path='/dashboard' element={< DashboardPage />} />
            <Route path='/user-management' element={<UserManagementPage />} />
        </Routes>
    )
}

export default AdminRoutes
