import { Link } from 'react-router-dom';
import image from'../../../assets/6324913.jpg'
import './ErrorPage.css';

const ErrorPage = () => {
    return (
        <div className="not-found-container">
            <div className="image-container">
                <img src={image} alt="Page Not Found" />
            </div>
            <div className="text-container not-found">
                <h1>404</h1>
                <h2>Oops! Page Not Found</h2>
                <p>Sorry, the page you are looking for does not exist or was moved.</p>
                <Link to="/login" className="back-link">
                    Go to Dashboard
                </Link>
            </div>
        </div>


    );
};

export default ErrorPage;
