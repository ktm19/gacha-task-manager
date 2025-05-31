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
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { a } from 'framer-motion/client';

axios.defaults.baseURL = 'http://localhost:8080';

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
    axios.get("/login", { 
      withCredentials: true 
    }).then((response) => {
      // console.log(response);
      // console.log("Response Test");
      if (response.data.loggedIn === true) {
        console.log("Logged In: " + response.data.user.username);
        navigate("/dashboard");

      }
    });
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <div className = "p-4 justify-center items-center flex flex-col h-screen bg-gray-100">
      <h1 className = "text-xl font-bold mb-4"> Login </h1>
      <TextFieldSubmit 
        numFields={2} 
        onSubmit={(values) => {
          const [username, password] = values;
          login(username, password);
        }}
        fieldPlaceholders={['Username', 'Password']}
      />
      <div className="mt-4">
        <p className="text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login


