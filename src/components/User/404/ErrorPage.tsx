import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ErrorPage.css'; // Import the CSS file

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="error-page">
      <div className="error-content">
        <h1 className="error-title">404</h1>
        <p className="error-subtitle">Oops! Page Not Found</p>
        <p className="error-message">The page you're looking for doesn't exist.</p>
        <button
          onClick={handleGoHome}
          className="error-button"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
