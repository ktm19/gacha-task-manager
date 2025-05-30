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

axios.defaults.baseURL = 'http://localhost:8080';
/*
function submitRegister() {
  
}
*/
function Register() {
  const navigate = useNavigate();

  const register = (un, pw) => {
    axios.post("/register", {
      username: un, 
      password: pw,
    }).then((response) => {
      alert("Registration successful! :)")
      console.log(response);
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
  }, []);

  console.log("Register page loaded");
  return (
    <div className = "p-4 justify-center items-center flex flex-col h-screen bg-gray-100">
      <h1 className = "text-xl font-bold mb-4"> Register </h1>
      <TextFieldSubmit 
        numFields={3} 

        onSubmit={(values) => {
          const [username, password, confirmPassword] = values;
          if (password !== confirmPassword) {
            alert("Passwords do not match!");
            console.log("Passwords do not match!");
            return;
          }
          register(username, password);
        }}

        fieldPlaceholders={['Username', 'Password', "Re-enter Password"]}
      />
      
      <div className="mt-4">
        <p className="text-sm">
          Already Registered?{' '}
          <Link to="/" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
        </div>
    </div>
  );
}
export default Register





