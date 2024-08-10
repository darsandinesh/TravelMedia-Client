import { Routes, Route } from 'react-router-dom';
import AdminLogin from '../components/Admin/Auth/AdminLogin/AdminLogin';
import Dashboard from '../components/Admin/Home/Dashboard';

const AdminRoutes = () => {
    return (

        <Routes>
            <Route path='/' element={<AdminLogin />} />
            <Route path='/dashboard' element={< Dashboard />} />
        </Routes>
    )
}

export default AdminRoutes
