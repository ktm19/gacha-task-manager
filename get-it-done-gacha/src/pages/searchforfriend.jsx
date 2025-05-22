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
    setUserToSearchFor(values[0]);
    setShowSearchResults(true); // Update state to render the component
    console.log("handleClick says userToSearchFor is " + userToSearchFor);
  };

  const test = (userObj) => {
    console.log("got username: " + userObj["username"]);
  }

  console.log("Search for friends page loaded");
  return (
    <div className = "p-4 justify-center items-center flex flex-col h-screen bg-gray-100">
      {showSearchResults && <SearchForUser username={userToSearchFor} toDo={test}/>}
      <h1 className = "text-xl font-bold mb-4"> Search for a friend </h1>
      <TextFieldSubmit 
        numFields={1} 
        onSubmit={(values) => handleClick(values)} 
        fieldPlaceholders={['Username']}
      />

      <br></br>

      {showSearchResults && <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" style={{marginRight: '2em'}}> Add friend </button>}
      {showSearchResults && <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"> Remove friend </button>}

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