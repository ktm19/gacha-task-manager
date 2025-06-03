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
import axios from 'axios';

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

function SearchForFriend() {
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResultMessage, setSearchResultMessage] = useState("");
  const [username, setUsername] = useState("");
  const [friend, setFriend] = useState("");

  const search = (username) => {
    axios.get("/searchForUser?username=" + username).then((response) => {
      setSearchResultMessage("Found: " + (response.data)["username"]);
      setShowSearchResults(true);
      setFriend((response.data)["username"]);
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
    if (username == "") { // check to make sure username set
      alert("Not logged in");
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
    if (username == "") {
      alert("Not logged in");
      return;
    }
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

  // console.log("Search for friends page loaded");

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      setUsername("");
      return;
    }
    setUsername(username);
  }, []);

  return (
    <div style={{marginBottom: '10px'}} className = "p-4 justify-center items-center flex flex-col h-screen bg-gray-100">
      <h1 className = "text-xl font-bold mb-4"> Search for a friend </h1>
      <TextFieldSubmit 
        numFields={1} 
        // onSubmit={(values) => handleClick(values)} 
        onSubmit={(username) => search(username)}
        fieldPlaceholders={['Username']}
      />

      <br></br>

      <p style={{marginBottom: '10px'}}>{searchResultMessage}</p>
      <span>{showSearchResults && <button type="submit" style={{ marginRight: '1em', 'background-color': "#662d2d", 'color': "#f5efe0"}} onClick={() => {add_friend(friend);}} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"> Add friend </button>}
      {showSearchResults && <button type="submit" style={{ marginLeft: '1em', 'background-color': "#662d2d", 'color': "#f5efe0"}} onClick = {() => {remove_friend(friend);}} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"> Remove friend </button>}
      </span>

    </div>
  );
}
export default SearchForFriend



