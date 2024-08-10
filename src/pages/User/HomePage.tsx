import React from 'react';
import Content from '../../components/User/Home/Content/Content';
import NavBar from '../../components/User/Home/NavBar/NavBar';
import SideBar from '../../components/User/Home/SideBar/SideBar';

const HomePage: React.FC = () => {
    return (
        <div className="flex flex-col h-screen">
            <NavBar />
            <div className="flex flex-grow">
                <SideBar />
                <main className="flex flex-grow items-center justify-center p-4 ml-[250px]">
                    <Content />
                </main>
            </div>
        </div>
    );
};

export default HomePage;
