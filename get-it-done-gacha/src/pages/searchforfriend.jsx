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

import React, { useState } from 'react';
//in a new dir, make sure to go up 1 more level
import '../App.css' 
import TextFieldSubmit from '../textFieldSubmit.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.baseURL = 'http://localhost:8080';

function SearchForFriend() {
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResultMessage, setSearchResultMessage] = useState("");
  const [username, setUsername] = useState("");
  const [friend, SetFriend] = useState("");

  const search = (username) => {
    axios.get("/searchForUser?username=" + username).then((response) => {
      // alert("Searching for: " + username);
      console.log(response.data);
      console.log("aaa");
      console.log((response.data)["username"]);
      setSearchResultMessage("Found: " + (response.data)["username"]);
      setShowSearchResults(true); // Update state to render the component
      SetFriend((response.data)["username"]);
    }).catch((error) => {
      setShowSearchResults(false);
      if (error.response) {
        // alert(error.response.data);
        setSearchResultMessage(error.response.data);
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

  const add_friend = (fn) => {
    // check to make sure username set
    if (username == "") {
      alert("Username is empty");
      return;
    }
    axios.post("/addFriend", {
      username: username,
      friend_name: fn,
    }).then((response) => {
      setSearchResultMessage("Added friend: " + fn);
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

  const remove_friend = (fn) => {
    // check to make sure username set
    // if (username == "") {
    //   alert("Username is empty");
    //   return;
    // }
    axios.post("/removeFriend", {
      username: username,
      friend_name: fn,
    }).then((response) => {
      setSearchResultMessage("Removed friend: " + fn);
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

  console.log("Search for friends page loaded");


  // TODO: make sure to set username here!

  // useEffect(()=> {
  //   console.log("Use effect test");
  //   axios.get("/login").then((response) => {
  //     console.log(response);
  //     if (response.data.loggedIn) {
  //       console.log(response.data.user[0].username);
  //     }
  //   })
  // })


  return (
    <div className = "p-4 justify-center items-center flex flex-col h-screen bg-gray-100">
      <h1 className = "text-xl font-bold mb-4"> Search for a friend </h1>
      <TextFieldSubmit 
        numFields={1} 
        // onSubmit={(values) => handleClick(values)} 
        onSubmit={(username) => search(username)}
        fieldPlaceholders={['Username']}
      />

      <br></br>

      <p>{searchResultMessage}</p>
      {showSearchResults && <button type="submit" onClick={() => {add_friend(friend);}} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" style={{marginRight: '2em'}}> Add friend </button>}
      {showSearchResults && <button type="submit" onClick = {() => {remove_friend(friend);}} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"> Remove friend </button>}

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



