import React, { useEffect } from 'react';
import Content from '../../components/User/Home/Content/Content';
import NavBar from '../../components/User/Home/NavBar/NavBar';
// import SideBar from '../../components/User/Home/SideBar/SideBar';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/User/Home/footer/Footer';
import FriednSuggestion from '../../components/User/Home/FriendSuggestion/FriednSuggestion';

const HomePage: React.FC = () => {

    const navigate = useNavigate()

    useEffect(() => {
        const userToken = localStorage.getItem('userToken');
        if (!userToken) navigate('/');

    }, []);
    return (
        <div className="flex flex-col h-screen">
            <NavBar />
            <div className="flex flex-grow">
                <main className="flex flex-grow items-center justify-center p-4 ml-[250px]">
                    <Content />
                    <div style={{position:'fixed'}}>
                    <FriednSuggestion />
                    </div>
                </main>
            </div>
            {/* <div >
                <Footer />
            </div> */}
        </div>
    );
};

export default HomePage;
