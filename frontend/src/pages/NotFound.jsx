// frontend/src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import './NotFound.css';

const NotFound = () => {
  return (
    <DashboardLayout>
      <div className="not-found-page">
        <div className="not-found-content">
          <h1 className="error-code">404</h1>
          <h2 className="error-title">Page Not Found</h2>
          <p className="error-message">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="back-home-button">
            Return Home
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotFound;