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

import React, { useState, useEffect } from 'react';
import '../App.css' 
import TextFieldSubmit from '../textFieldSubmit.jsx';
import PasswordTextFieldSubmit from '../passwordTextFieldSubmit.jsx'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { a } from 'framer-motion/client';

function Login() {
  const navigate = useNavigate();
  
  const login = (un, pw) => {
    axios.post("/login", {
      username: un, 
      password: pw,
    },
    {
      withCredentials: true
    }).then((response) => {
      alert("Login successful! :)")
      // console.log(response);
      // console.log("Logged In");
      localStorage.setItem("username", un);
      navigate("/dashboard");
    }).catch((error) => {
      if (error.response) {
        alert(error.response.data);
        console.log(error.response.data);
      } else if (error.request) {
        alert("No response from server.");
        console.log("No response from server.");
      } else {
        alert("A critical error has occured :(");
        console.log("Axios error:", error.message);
      }
    });
  };

  const logout = () => {
    localStorage.removeItem("username");
    navigate("/");
    alert("Logged out successfully!");
  }

  
  useEffect(() => {
    const username = localStorage.getItem('username');
    
    if (!username) {
      return;
    }
    
    navigate("/dashboard");
  }, []); // No dependencies needed since we only want this to run once on mount

  return (
    <div className = "p-4 justify-center items-center flex flex-col h-screen bg-gray-100">
      <h1 className = "text-xl font-bold mb-4"> Login </h1>
      <PasswordTextFieldSubmit 
        numFields={2} 
        onSubmit={(values) => {
          const [username, password] = values;
          login(username, password);
        }}
        fieldPlaceholders={['Username', 'Password']}
      />
      <div style={{marginTop: '10px'}} className="mt-4">
        <p className="text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="a text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
      <div className="flex-shrink-0">
        <img src="eggert2.png" alt="Logo" width="160" height="auto" border-radius="15px" className="h-10 w-auto" />
      </div>
      <div className="flex-shrink-0">
        <img src="blank.png" alt="Logo" width="20" height="auto" border-radius="15px" className="h-10 w-auto" />
      </div>
    </div>
  );
}

export default Login





