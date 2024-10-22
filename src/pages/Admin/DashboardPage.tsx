import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/Admin/Home/NavBar/NavBar';
import AdminDashboard from '../../components/Admin/Home/AdminDashboard';

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
        }
    }, [navigate]);

    return (
        <div className="flex flex-col h-screen">
            <NavBar />
            <div className="flex flex-grow">
                <main className="flex flex-grow items-center justify-center p-4 ml-[250px]">
                    <AdminDashboard />
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;
