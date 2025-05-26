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



