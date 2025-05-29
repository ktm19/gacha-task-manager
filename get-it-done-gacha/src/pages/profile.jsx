import React, { useState, useEffect } from 'react';
import '../App.css';
import '../styles/Profile.css';
import TextFieldSubmit from '../textFieldSubmit.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';

function Profile() {
  const [username, setUsername] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResultMessage, setSearchResultMessage] = useState("");
  const [friendsList, setFriendsList] = useState([]);

  const containerStyle = {
    backgroundImage: 'url(/bliss_background.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  const get_friends = () => {
    axios.get("/getFriends?username=" + username).then((response) => {
        console.log(response.data);
        const newFriendsList = [];
        for (let i = 0; i < response.data.length; i++) {
            newFriendsList.push(<li key={i}>{(response.data)[i]["name"]}</li>);
        }
        setFriendsList(newFriendsList);
        setShowSearchResults(true);
      }).catch((error) => {
        setShowSearchResults(false);
        if (error.response) {
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

  useEffect(() => {
    axios.get("/login", { 
      withCredentials: true 
    }).then((response) => {
      // console.log(response);
      // console.log("Response Test");
      if (response.data.loggedIn === true) {
        console.log("Logged In: " + response.data.user.username);
        setUsername(response.data.user.username);
      }
    });
  }, []);

  return (
    <div className="profile-container" style={containerStyle}>
      {/* Username in top left */}
      <div className="username">
        <h2><Link to={`/dashboard`} className="username-link">
          {username || "Guest"}
        </Link></h2>
      </div>

      {/* Status Box */}
      <div className="status-box">
        <span className="status-label">
          Status
        </span>
        <div className="status-content">
          Status placeholder
        </div>
      </div>

      {/* Bottom Section Container */}
      <div className="bottom-section">
        {/* Shelf Section */}
        <div className="section">
          <h2 className="section-title">My Shelf</h2>
          <div className="section-content">
            <div className="shelf-grid">
              {/* 4 placeholder squares */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="shelf-item">
                  Shelf Item {i}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Friends Section */}
        <div className="section">
          <h2 className="section-title">Friends</h2>
          <div className="section-content">
            <div className="friends-list">
              {friendsList.length > 0 ? (
                <ul>{friendsList}</ul>
              ) : (
                "No friends added yet"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;


