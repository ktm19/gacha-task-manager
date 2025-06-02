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
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center h-16 gap-4">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              disabled={link.path === currentPath}
              style={{margin: '5px'}}
              className={`flex-1 text-center py-2 px-4 mx-2 rounded-lg border-2 transition-all duration-200 ${
                link.path === currentPath
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'text-gray-600 hover:text-blue-500 hover:border-blue-500 border-transparent'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            style={{margin: '5px'}}
            className="flex-1 text-center py-2 px-4 mx-2 rounded-lg border-2 border-transparent text-gray-600 hover:text-red-500 hover:border-red-500 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
