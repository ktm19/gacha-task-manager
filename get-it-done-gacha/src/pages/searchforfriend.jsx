import React, { useState, useEffect } from 'react';
//in a new dir, make sure to go up 1 more level
import '../App.css' 
import TextFieldSubmit from '../textFieldSubmit.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.baseURL = 'http://localhost:8080';

function SearchForFriend() {
    const [results, setResults] = useState([]);
  
    useEffect(() => {
      axios.get("/searchForFriend?username=test").then((response) => {
        setResults(response.data);
      });
    }, []);
    console.log(results);
    console.log(results["username"]);

    console.log("Search for friends page loaded");
  return (
    <div className = "p-4 justify-center items-center flex flex-col h-screen bg-gray-100">
      <h1 className = "text-xl font-bold mb-4"> Login </h1>
      <TextFieldSubmit 
        numFields={1} 
        onSubmit={(values) => alert(`Submitted`)} 
        fieldPlaceholders={['Username']}
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
export default SearchForFriend