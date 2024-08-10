// import React from 'react';
import Sidebar from './SideBar';
import Header from './Header';
import Table from './Table';

const Dashboard = () => (
  <div className="flex h-screen bg-gray-900 text-white">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1 p-6 overflow-auto">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Charts</h2>
          <div className="overflow-x-auto">
            <Table />
          </div>
        </div>
      </main>
    </div>
  </div>
);

export default Dashboard;
