import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar/NavBar';
// import Sidebar from './SideBar/SideBar';
// import Table from './Table';

const Dashboard: React.FC = () => {
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
        {/* <Sidebar /> */}
        <main className="flex flex-grow items-center justify-center p-4 ml-[250px]">
          {/* <Table /> */}
          <h1>Admin Dashboard</h1>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
