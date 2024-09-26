import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SideBar.css';

const SideBar = () => {

    const navigate = useNavigate();
    const [showMoreOptions, setShowMoreOptions] = useState(false);

    return (
        <div className="sidebar">
            
            <nav className="nav-links">
                <a className="nav-link">
                    Home
                </a>
                <hr className="separator" />
                <a className="nav-link">
                    Find Buddy
                </a>
                <hr className="separator" />
                <a className="nav-link">
                    Search
                </a>
                <hr className="separator" />
                <a className="nav-link">
                    Add Posts
                </a>
                <hr className="separator" />
                <a className="nav-link">
                    Profile
                </a>
            </nav>
            <div className="more-link">
                <a className="nav-link" onClick={() => setShowMoreOptions(!showMoreOptions)}>
                    More
                </a>
                {showMoreOptions && (
                    <div className="more-options">
                        <a onClick={() => navigate('/')} className="nav-link">Logout</a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SideBar;
