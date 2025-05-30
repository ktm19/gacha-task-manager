import React, { useState, useEffect } from 'react';
import '../App.css';
import '../styles/Profile.css';
import TextFieldSubmit from '../textFieldSubmit.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';

function Profile() {
  const [username, setUsername] = useState("");
  const [friendsList, setFriendsList] = useState([]);
  const [userStatus, setUserStatus] = useState("");
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const maxStatusLength = 100;

  const containerStyle = {
    backgroundImage: 'url(/bliss_background.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  const handleClick = (username) => {
    console.log("handleClick entered");
    setUsername(username);
    setFriendsList([]);
    getFriendsList(username);
  }

  const getFriendsList = (username) => {
    console.log("entered getFriendsList");
    if (username == "") return;

    axios.get("/getFriends?username=" + username).then((response) => {
      console.log(response.data);
      const newFriendsList = [];
      for (let i = 0; i < response.data.length; i++) {
          newFriendsList.push(<button key = {i} type="submit" onClick={() => {handleClick((response.data)[i]["name"]);}}><li key={i}>{(response.data)[i]["name"]}</li></button>);
      }
      setFriendsList(newFriendsList);
    }).catch((error) => {
      if (error.response) {
        console.log(error.response.data);
      } else if (error.request) {
        alert("No response from server.");
        console.log("No response from server.");
      } else {
        alert("A critical error has occured :(");
        console.log("Axios error:", error.message);
      }
    });
  }

  const updateStatus = (newStatus) => {
    if (!username) {
      console.log('[DEBUG] Cannot update status: no username');
      return;
    }
    
    if (newStatus.length > maxStatusLength) {
      console.log('[DEBUG] Status too long:', newStatus.length);
      return;
    }
    
    console.log('[DEBUG] Sending status update. Username:', username, 'Status:', newStatus);
    
    axios.post("/updateStatus", {
      username: username,
      status: newStatus
    }, {
      withCredentials: true
    }).then((response) => {
      console.log('[DEBUG] Status update response:', response.data);
      const updatedStatus = response.data.status;
      console.log('[DEBUG] Setting status to:', updatedStatus);
      setUserStatus(updatedStatus);
    }).catch((error) => {
      console.error('[DEBUG] Status update error:', error);
      if (error.response) {
        console.error('[DEBUG] Server error:', error.response.data);
      } else if (error.request) {
        console.error('[DEBUG] No server response');
      } else {
        console.error('[DEBUG] Request failed:', error.message);
      }
    });
  };

  const fetchUserStatus = (username) => {
    if (!username) {
      console.log('[DEBUG] Cannot fetch status: no username');
      return;
    }
    
    console.log('[DEBUG] Fetching status for user:', username);
    
    axios.get("/getUserStatus", {
      params: { username },
      withCredentials: true
    }).then((response) => {
      console.log('[DEBUG] Status fetch response:', response.data);
      const fetchedStatus = response.data.status;
      console.log('[DEBUG] Setting fetched status:', fetchedStatus);
      setUserStatus(fetchedStatus || '');
    }).catch((error) => {
      console.error('[DEBUG] Status fetch error:', error);
      if (error.response) {
        console.error('[DEBUG] Server error:', error.response.data);
      } else if (error.request) {
        console.error('[DEBUG] No server response');
      } else {
        console.error('[DEBUG] Request failed:', error.message);
      }
      setUserStatus('');
    });
  };

  useEffect(() => {
    console.log('[DEBUG] Profile component mounted');
    
    if (username) {
      console.log('[DEBUG] Username available:', username);
      setFriendsList([]);
      fetchUserStatus(username);
      return;
    }

    console.log('[DEBUG] Checking login status');
    axios.get("/login", { 
      withCredentials: true 
    }).then((response) => {
      console.log('[DEBUG] Login response:', response.data);
      if (response.data.loggedIn === true) {
        const user = response.data.user.username;
        console.log('[DEBUG] Setting username to:', user);
        setUsername(user);
        fetchUserStatus(user);

        if (!user) {
          console.log('[DEBUG] No username in login response');
          return;
        }

        axios.get("/getFriends?username=" + user).then((response) => {
          const newFriendsList = [];
          for (let i = 0; i < response.data.length; i++) {
              newFriendsList.push(<button key={i} type="submit" onClick={() => {handleClick((response.data)[i]["name"]);}}><li key={i}>{(response.data)[i]["name"]}</li></button>);
          }
          setFriendsList(newFriendsList);
        }).catch((error) => {
          if (error.response) {
            console.log(error.response.data);
          } else if (error.request) {
            console.log("No response from server.");
          } else {
            console.log("Axios error:", error.message);
          }
        });
      }
    });
  }, []);

  // Add an effect to update status when username changes
  useEffect(() => {
    fetchUserStatus(username);
  }, [username]);

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
          <textarea
            value={userStatus}
            onChange={(e) => {
              if (e.target.value.length <= maxStatusLength) {
                setUserStatus(e.target.value);
                updateStatus(e.target.value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.target.blur();
              }
            }}
            className="status-textarea"
            placeholder={userStatus ? "" : "What's on your mind?"} /*only show placeholder if no status exists*/
          />
          <div className="character-counter">
            {userStatus.length}/{maxStatusLength}
          </div>
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


