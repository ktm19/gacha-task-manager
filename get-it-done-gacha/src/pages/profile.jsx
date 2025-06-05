import React, { useState, useEffect } from 'react';
import '../App.css';
import '../styles/Profile.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ItemCard from './itemcard';

axios.defaults.withCredentials = true;


function Profile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [displayUser, setDisplayUser] = useState("");
  const [friendsList, setFriendsList] = useState([]);
  const [userStatus, setUserStatus] = useState("");
  const [error, setError] = useState("");
  const maxStatusLength = 100;
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [itemDescriptions, setItemDescriptions] = useState({});

  const [selectedImages, setSelectedImages] = useState(Array(4).fill(null));
  const [activeSlot, setActiveSlot] = useState(null);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);

  const handleClick = (user) => {
    const origUser = localStorage.getItem('username');

    console.log("user: " + user + ", origUser: " + origUser);
    setDisplayUser(user);
    console.log("set display user to " + user);
    setFriendsList([]);
    getFriendsList(user);
    fetchUserStatus(user);
    setInventoryItems([]);
    if (user == origUser) {
      fetchInventory(origUser);
    }
    fetchShelfLayout(user);
  }

  const getFriendsList = (username) => {
    if (!username) return;

    axios.get(`/getFriends?username=${username}`, {
      withCredentials: true
    })
      .then((response) => {
        const newFriendsList = [];
        for (let i = 0; i < response.data.length; i++) {
          newFriendsList.push(
            <button key={i} type="submit" style={{margin: '5px', listStyleType: 'none', 'background-color': "#662d2d", 'color': "#f5efe0"}} onClick={() => {handleClick((response.data)[i]["name"]);}}>
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
      const response = await axios.get(`/getUserStatus`, { 
        params: { username },
        withCredentials: true 
      });
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
      const response = await axios.put(`/updateUserStatus`, 
        { status: newStatus }, 
        { 
          params: { username },
          withCredentials: true 
        }
      );
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

  /* Save the current shelf layout to the server */
  const saveShelfLayout = async () => {
    if (!username) return;
    
    try {
      console.log('Saving shelf layout for user:', username);
      // Map the image paths back to item names
      const slots = selectedImages.map(imagePath => {
        if (!imagePath) return null;
        // First try to find the item in inventory
        const item = inventoryItems.find(item => item.path === imagePath);
        if (item) return item.name;
        // If not found in inventory (which might happen right after loading), try to get name from path
        console.log('Image path:', imagePath);
        return null;
      });

      await axios.put('/updateShelf', 
        { slots }, 
        { 
          params: { username },
          withCredentials: true 
        }
      );
      console.log('Shelf layout saved successfully');
    } catch (error) {
      console.error('Failed to save shelf layout:', error);
      console.error('Error details:', error.response?.data);
    }
  };
  /* note not been tested yet bc i hve nothing in my inventory */

  /* shelf image selection logic */
  const handleSlotClick = (index) => {
    if (username != displayUser) return;
    setActiveSlot(index);
    setShowImageSelector(true);
  };

  const handleSlotRightClick = (e, index) => {
    if (username != displayUser) return;
    e.preventDefault(); // Prevent the default context menu
    if (selectedImages[index]) {
      const newSelectedImages = [...selectedImages];
      newSelectedImages[index] = null;
      setSelectedImages(newSelectedImages);
      saveShelfLayout();
    }
  };

  const handleImageSelect = (image) => {
    if (activeSlot !== null) {
      const newSelectedImages = [...selectedImages];
      newSelectedImages[activeSlot] = image;
      setSelectedImages(newSelectedImages);
      setShowImageSelector(false);
      // Use the new images array directly instead of relying on state
      const slots = newSelectedImages.map(imagePath => {
        if (!imagePath) return null;
        const item = inventoryItems.find(item => item.path === imagePath);
        return item ? item.name : null;
      });
      
      // Save using the new array directly
      axios.put('/updateShelf', 
        { slots }, 
        { 
          params: { username },
          withCredentials: true 
        }
      ).then(() => {
        console.log('Shelf layout saved successfully with items:', slots);
      }).catch(error => {
        console.error('Failed to save shelf layout:', error);
      });
    }
  }

  const fetchShelfLayout = async (username) => {
    if (!username) return;
    
    try {
      console.log('Fetching shelf layout for user:', username);
      const response = await axios.get('/getShelf', {
        params: { username },
        withCredentials: true
      });
      console.log('Shelf layout response:', response.data);
      // Use the image paths instead of slots for display
      setSelectedImages(response.data.images || Array(4).fill(null));
    } catch (error) {
      console.error('Failed to fetch shelf layout:', error);
      setSelectedImages(Array(4).fill(null));
    }
  };

  /* inventory fetching logic */
  const fetchInventory = async (username) => {
    if (!username) return;
    
    try {
      console.log('Fetching inventory for user:', username);
      const response = await axios.get('/inventory', {
        params: { username },
        withCredentials: true
      });
      console.log('Inventory response:', response.data);
      setInventoryItems(response.data.map((item, index) => ({
        id: index + 1,
        name: item.item_name,
        path: item.img_path
      })));
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      setInventoryItems([]);
    }
  };

  const loadItemDescriptions = async () => {
    try {
      const response = await fetch('/itemDescriptions.json');
      const data = await response.json();
      setItemDescriptions({ ...data.three, ...data.four });
    } catch (error) {
      console.error('Failed to load item descriptions:', error);
    }
  };

  // fixed 12:30pm 5/31/25 YAYYYY
  // fix involved using the same login logic
  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      setUsername("");
      return;
    }
    setUsername(username);
    setDisplayUser(username);
    fetchUserStatus(username);
    getFriendsList(username);
    fetchInventory(username);
    fetchShelfLayout(username);
    loadItemDescriptions();
  }, []); // No dependencies needed since we only want this to run once on mount

  
  return (
    <div className="profile-container">
      {/* Username in top left */}
      <div className="username">
        <h2>
          <Link to={`/dashboard`} className="username-link">
            {(displayUser || "Guest") + "'s Profile"}
          </Link>
        </h2>
      </div>

      {/* Status Box */}
      <div> <h2 className="status-label">Status</h2> </div>
      <div className="status-box">
        <div className="status-content">
          {username ? (
            <>
              <textarea
                value={userStatus}
                onChange={(e) => {
                  if (username != displayUser) return;
                  const newStatus = e.target.value;
                  if (newStatus.length <= maxStatusLength) {
                    setUserStatus(newStatus);
                  }
                }}
                onBlur={() => {
                  if (username != displayUser) return;
                  updateStatus(userStatus) 
                  }
                }
                onKeyDown={(e) => {
                  if (username != displayUser) return;
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
              {Array(4).fill(null).map((_, i) => (
                <div
                  key={i}
                  className="shelf-item"
                  onClick={() => handleSlotClick(i)}
                  onContextMenu={(e) => handleSlotRightClick(e, i)}
                  onMouseEnter={() => {
                    if (selectedImages[i]) {
                      // extract the filename from the path
                      const filename = selectedImages[i].split('/').pop();
                      // Remove both .PNG and .jpg extensions and convert to lowercase to get img name to match
                      // itemDesc...json
                      const itemKey = filename.replace(/\.(png|jpg)$/i, '').toLowerCase();
                      console.log('Looking up description for:', itemKey);
                      const description = itemDescriptions[itemKey];
                      if (description) {
                        setHoveredItem({
                          image: selectedImages[i],
                          description: description
                        });
                      }
                    }
                  }}
                  onMouseLeave={() => setHoveredItem(null)}
                  onMouseMove={(e) => {
                    setMousePosition({
                      x: e.clientX + 10,
                      y: e.clientY + 10
                    });
                  }}
                  title={selectedImages[i] ? "Right-click to remove item" : "Click to add an item"}
                  style={{
                    cursor: 'pointer',
                    background: selectedImages[i] 
                      ? `url(${selectedImages[i]}) center/contain no-repeat`
                      : 'rgba(255, 255, 255, 0.05)',
                  }}
                > 
                  {!selectedImages[i] && <span>Click to add item</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {hoveredItem && (
          <ItemCard
            image={hoveredItem.image}
            description={hoveredItem.description}
            position={mousePosition}
          />
        )}

        {/* Image Selector Modal */}
        {showImageSelector && (
          <div className="image-selector-modal">
            <div className="modal-content">
              <h3>Inventory</h3>
              <div className="image-grid">
                {inventoryItems.map((image) => (
                  <div
                    key={image.id}
                    className="image-option"
                    onClick={() => handleImageSelect(image.path)}
                  >
                    <img src={image.path} alt={image.name} />
                    <span>{image.name}</span>
                  </div>
                ))}
              </div>
              <button 
                className="close-button"
                onClick={() => setShowImageSelector(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Friends Section */}
        <div style={{ display: 'flex', justifyContent: 'center' }}  className="section">
          <h2 className="section-title">Friends</h2>
          <div className="section-content">
            <div style={{ marginRight: '3em'}} className="friends-list">
              {friendsList.length > 0 ? (
                <ul>{friendsList}</ul>
              ) : (
                "No friends added yet"
              )}
            </div>

            <br></br>
            <button 
            style={{margin: '5px', 'background-color': "#662d2d", 'color': "#f5efe0"}}
            onClick={() => navigate("/searchforfriend")}>
              Search for a friend
            </button>


          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;


