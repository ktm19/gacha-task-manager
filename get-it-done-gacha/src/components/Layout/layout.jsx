import React from 'react';
import Navbar from '../Navbar/navbar.jsx'; // Adjust the import path as necessary

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen pb-20 relative"> {/* Increased padding to prevent content from being hidden */}
      <div className="overflow-y-auto h-full">
        {children}
      </div>
      <Navbar />
    </div>
  );
};

export default Layout;
