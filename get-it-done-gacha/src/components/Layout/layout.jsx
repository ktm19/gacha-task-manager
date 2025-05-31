import React from 'react';
import Navbar from '../Navbar/navbar.jsx'; // Adjust the import path as necessary

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen pb-16"> {/* Add padding bottom to prevent content from being hidden by navbar */}
      {children}
      <Navbar />
    </div>
  );
};

export default Layout;
