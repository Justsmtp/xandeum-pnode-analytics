// frontend/src/components/layout/DashboardLayout.jsx
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Navbar />
      <main className="dashboard-main">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;