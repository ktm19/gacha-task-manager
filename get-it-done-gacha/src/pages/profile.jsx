import React, { useState, useEffect } from 'react';
import '../App.css' 
import TextFieldSubmit from '../textFieldSubmit.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';

function Profile() {
  const [username, setUsername] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResultMessage, setSearchResultMessage] = useState("");

  const get_friends = () => {
    axios.get("/getFriends?username=" + username).then((response) => {
        console.log(response.data);
        console.log("aaa");
        console.log((response.data)[0]["username"]);
        setShowSearchResults(true); // Update state to render the component
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

  useEffect(()=> {
    console.log("Use effect test");
    axios.get("/login").then((response) => {
      console.log(response);
      if (response.data.loggedIn == true) {
        console.log(response.data.user[0].username);
        setUsername(response.data.user[0].username);
      }
    })
  })

  return (
    <div className = "p-4 justify-center items-center flex flex-col h-screen bg-gray-100">
      <h1 className = "text-xl font-bold mb-4"> Profile </h1>

      <form onSubmit={() => { get_friends(); }} className="flex flex-col gap-2 p-4">
            <button 
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
                Get friends list
            </button>
        </form>
    
        <br></br>

        <p>{searchResultMessage}</p>
        {showSearchResults && <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" style={{marginRight: '2em'}}> Add friend </button>}
        {showSearchResults && <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"> Remove friend </button>}

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

export default Profile


