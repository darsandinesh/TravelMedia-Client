import UserProfile from '../../components/User/UserProfile/UserProfile';
import NavBar from '../../components/User/Home/NavBar/NavBar';

const UserProfilePage = () => {
    return (
        <div className="flex flex-col h-screen">
            <NavBar />
            <div className="flex flex-grow">
                <main className="flex flex-grow items-center justify-center p-4 ml-[250px]">
                    <UserProfile />
                </main>
            </div>
        </div>
    );
};

export default UserProfilePage;
