import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from '../../pages/login';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate('/');
    alert("Logged out successfully!");
  };

  const links = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/gacha', label: 'Gacha' },
    { path: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {links.map((link) => (
            link.path !== currentPath && (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium"
              >
                {link.label}
              </Link>
            )
          ))}
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
