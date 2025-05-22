import React, { useState, useEffect } from 'react';
//in a new dir, make sure to go up 1 more level
import '../App.css' 
import TextFieldSubmit from '../textFieldSubmit.jsx';
import { Link } from 'react-router-dom';
import SearchForUser from '../databaseComponents/searchforuser.jsx';
import axios from 'axios';

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.baseURL = 'http://localhost:8080';

function SearchForFriend() {
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [userToSearchFor, setUserToSearchFor] = useState("");

  const handleClick = (values) => {
    setShowSearchResults(true); // Update state to render the component
    setUserToSearchFor(values[0]);
    console.log(userToSearchFor);
  };

  const test = (userObj) => {
    console.log("got username: " + userObj["username"]);
  }

  console.log("Search for friends page loaded");
  return (
    <div className = "p-4 justify-center items-center flex flex-col h-screen bg-gray-100">
      {showSearchResults && <SearchForUser username={userToSearchFor} toDo={test}/>}
      <h1 className = "text-xl font-bold mb-4"> Login </h1>
      <TextFieldSubmit 
        numFields={1} 
        onSubmit={(values) => handleClick(values)} 
        fieldPlaceholders={['Username']}
      />
      <div className="mt-4">
        <p className="text-sm">
          Want to go back?{' '}
          <Link to="/" className="text-blue-500 hover:underline">
            Home
          </Link>
        </p>
        </div>
    </div>
  );
}
export default SearchForFriend