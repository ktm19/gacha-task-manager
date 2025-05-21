import React, { useState, useEffect }  from 'react';
//import { useState } from 'react'
//in a new dir, make sure to go up 1 more level
import '../App.css' 
import TextFieldSubmit from '../textFieldSubmit.jsx';
import { Link } from 'react-router-dom';
function submitLogin(values) {

  alert("username: " + values[0] + " password: " + values[1] )

  const [results, setResults] = useState([]);

  console.log("smile");
  const login = {
    username: values[0],
    password: values[1]
  };
  useEffect(() => { //DOESN'T WORK LOL
    axios.get("/login",{login}).then((response) => {
      setResults(response.data);
    });
  }, []);
}


function Login() {
    console.log("Login page loaded");
  return (
    <div className = "p-4 justify-center items-center flex flex-col h-screen bg-gray-100">
      <h1 className = "text-xl font-bold mb-4"> Login </h1>
      <TextFieldSubmit 
        numFields={2} 
        onSubmit={(values) => submitLogin(values)} 
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