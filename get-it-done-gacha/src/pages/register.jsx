import React from 'react';
//import { useState } from 'react'
//in a new dir, make sure to go up 1 more level
import '../App.css' 
import TextFieldSubmit from '../textFieldSubmit.jsx';
import { Link } from 'react-router-dom';

function Register() {
    console.log("Register page loaded");
  return (
    <div className = "p-4 justify-center items-center flex flex-col h-screen bg-gray-100">
      <h1 className = "text-xl font-bold mb-4"> Register </h1>
      <TextFieldSubmit 
        numFields={3} 
        onSubmit={(values) => alert(`Submitted: ` + values)} 
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