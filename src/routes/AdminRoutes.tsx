import { Routes, Route } from 'react-router-dom';
import AdminLogin from '../components/Admin/Auth/AdminLogin/AdminLogin';
import DashboardPage from '../pages/Admin/DashboardPage';
import UserManagementPage from '../pages/Admin/UserManagementPage';
import PostList from '../pages/Admin/PostList';
import ErrorPage from '../components/Admin/404/ErrorPage';

const AdminRoutes = () => {
    return (

        <Routes>
            <Route path='/' element={<AdminLogin />} />
            <Route path='/dashboard' element={< DashboardPage />} />
            <Route path='/user-management' element={<UserManagementPage />} />
            <Route path='/posts' element={<PostList />} />
            <Route path='*' element={<ErrorPage />} />

        </Routes>
    )
}

export default AdminRoutes
