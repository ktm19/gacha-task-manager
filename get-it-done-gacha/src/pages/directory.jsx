/* ==========================================================

File Description: 

This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.

========================================================== */

import React from 'react';
import { Link } from 'react-router-dom';

function Directory() {
  const pages = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      description: 'View and manage your tasks'
    },
    {
      name: 'Profile',
      path: '/profile',
      description: 'View your profile and friends'
    },
    {
      name: 'Search for Friends',
      path: '/searchforfriend',
      description: 'Find and add new friends'
    },
    {
      name: 'Login',
      path: '/login',
      description: 'Sign in to your account'
    },
    {
      name: 'Register',
      path: '/register',
      description: 'Create a new account'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Directory</h1>
      
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <Link 
            key={page.path} 
            to={page.path}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-blue-600">{page.name}</h2>
              <p className="text-gray-600">{page.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Directory;