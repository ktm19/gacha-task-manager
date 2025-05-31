import React, { useState, useEffect } from 'react';
import '../App.css';
import '../styles/Profile.css';
//import TextFieldSubmit from '../textFieldSubmit.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

function Profile() {
  const [username, setUsername] = useState("");
  const [friendsList, setFriendsList] = useState([]);
  const [userStatus, setUserStatus] = useState("");
  const [error, setError] = useState("");
  const maxStatusLength = 100;

  const containerStyle = {
    backgroundImage: 'url(/bliss_background.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  const handleClick = (username) => {
    setUsername(username);
    setFriendsList([]);
    getFriendsList(username);
    fetchUserStatus(username);
  }

  const getFriendsList = (username) => {
    if (!username) return;

    axios.get(`/getFriends?username=${username}`)
      .then((response) => {
        const newFriendsList = [];
        for (let i = 0; i < response.data.length; i++) {
          newFriendsList.push(
            <button key={i} type="submit" onClick={() => {handleClick((response.data)[i]["name"]);}}>
              <li key={i}>{(response.data)[i]["name"]}</li>
            </button>
          );
        }
        setFriendsList(newFriendsList);
      })
      .catch((error) => {
        console.error('Failed to fetch friends list:', error);
        if (error.response?.status === 404) {
          setFriendsList([]);
        }
      });
  }

  const fetchUserStatus = async (username) => {
    if (!username) return;
    
    try {
      console.log('Fetching status for user:', username);
      const response = await axios.get(`/getUserStatus`, { params: { username } });
      console.log('Status response:', response.data);
      setUserStatus(response.data.status || '');
      setError('');
    } catch (error) {
      console.error('Failed to fetch user status:', error);
      setUserStatus('');
      if (error.response?.status === 404) {
        //setError('User not found');
      } else {
        //setError('Failed to load status');
      }
    }
  };

  const updateStatus = async (newStatus) => {
    if (!username) return;
    
    try {
      console.log('Updating status for user:', username, 'New status:', newStatus);
      const response = await axios.put(`/updateUserStatus`, { status: newStatus }, { params: { username } });
      console.log('Update response:', response.data);
      setUserStatus(response.data.status);
      setError('');
    } catch (error) {
      console.error('Failed to update status:', error);
      if (error.response?.status === 404) {
        setError('User not found');
      } else {
        setError('Failed to update status');
      }
      // Revert to previous status on error
      fetchUserStatus(username);
    }
  };

  useEffect(() => {
    axios.get("/login")
      .then((response) => {
        if (response.data.loggedIn === true) {
          const user = response.data.user.username;
          console.log('Logged in user:', user);
          setUsername(user);
          
          if (user) {
            fetchUserStatus(user);
            getFriendsList(user);
          }
        }
      })
      .catch((error) => {
        console.error('Failed to check login status:', error);
        setError('Failed to check login status');
      });
  }, []);

  return (
    <div className="profile-container" style={containerStyle}>
      {/* Username in top left */}
      <div className="username">
        <h2>
          <Link to={`/dashboard`} className="username-link">
            {username || "Guest"}
          </Link>
        </h2>
      </div>

      {/* Status Box */}
      <div className="status-box">
        <span className="status-label">Status</span>
        <div className="status-content">
          {username ? (
            <>
              <textarea
                value={userStatus}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  if (newStatus.length <= maxStatusLength) {
                    setUserStatus(newStatus);
                  }
                }}
                onBlur={() => updateStatus(userStatus)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    e.target.blur();
                  }
                }}
                className="status-textarea"
                placeholder="What's on your mind?"
              />
              <div className="character-counter">
                {userStatus.length}/{maxStatusLength}
              </div>
              {error && <div className="error-message">{error}</div>}
            </>
          ) : (
            <div className="guest-status">Login to set your status</div>
          )}
        </div>
      </div>

      {/* Bottom Section Container */}
      <div className="bottom-section">
        {/* Shelf Section */}
        <div className="section">
          <h2 className="section-title">My Shelf</h2>
          <div className="section-content">
            <div className="shelf-grid">
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


