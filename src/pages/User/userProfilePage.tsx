// src/pages/UserProfilePage.tsx

// import React from 'react';
import UserProfile from '../../components/User/UserProfile/UserProfile';
import SideBar from '../../components/User/Home/SideBar/SideBar';

const UserProfilePage = () => {
    return (
        <div className="flex-row min-h-screen bg-gray-100 ">
            {/* Sidebar */}
            <div className="w-1/4 bg-white shadow-lg">
                <SideBar />
            </div>
            {/* User Profile */}
            <div className="flex-grow p-6">
                <UserProfile />
            </div>
        </div>
    );
};

export default UserProfilePage;
