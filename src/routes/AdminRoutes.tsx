import { Routes, Route } from 'react-router-dom';
import AdminLogin from '../components/Admin/Auth/AdminLogin/AdminLogin';
import Dashboard from '../components/Admin/Home/Dashboard';
import UserManagementPage from '../pages/Admin/UserManagementPage';

const AdminRoutes = () => {
    return (

        <Routes>
            <Route path='/' element={<AdminLogin />} />
            <Route path='/dashboard' element={< Dashboard />} />
            <Route path='/user-management' element={<UserManagementPage />} />
        </Routes>
    )
}

export default AdminRoutes
