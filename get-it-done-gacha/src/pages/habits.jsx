import React, { useState, useEffect } from "react";
import "../styles/habits.css";
import { useNavigate } from 'react-router-dom';

const Habits = () => {
  const navigate = useNavigate();

  const [habits, setHabits] = useState([]);
  const [totalPulls, setTotalPulls] = useState(0);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [inputValues, setInputValues] = useState(["", "", "", ""]);
  
  // Authentication state
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({ username: "", password: "" });
  const [showRegister, setShowRegister] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Fetch all user data when logged in
  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn) {
        await Promise.all([fetchUserMoney(), fetchUserHabits()]);
      }
    };
    fetchData();
  }, [isLoggedIn]);

  // Add window focus event listener to refetch data
  useEffect(() => {
    const handleFocus = () => {
      if (isLoggedIn) {
        fetchUserMoney();
        fetchUserHabits();
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isLoggedIn]);

  // Implement Page Visibility API to detect when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isLoggedIn) {
        fetchUserMoney();
        fetchUserHabits();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isLoggedIn]);

  const fetchUserHabits = async () => {
    try {
      const response = await fetch("/getUserHabits", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setHabits(data.habits);
      }
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const checkLoginStatus = async () => {
    // try {
    //   const response = await fetch("/login", {
    //     method: "GET",
    //     credentials: "include",
    //   });
    //   if (response.ok) {
    //     const data = await response.json();
    //     if (data.loggedIn) {
    //       setUser(data.user);
    //       setIsLoggedIn(true);
    //     }
    //   }
    // } catch (error) {
    //   console.error("Error checking login status:", error);
    // } finally {
    //   setLoading(false);
    // }

      const username = localStorage.getItem('username');
      
      if (!username) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      setUser(username);
      setIsLoggedIn(true);
      setLoading(false);
  };

  const fetchUserMoney = async () => {
    try {
      const response = await fetch("/getUserMoney", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setTotalPulls(data.money);
      } else {
        console.error("Failed to fetch user money");
      }
    } catch (error) {
      console.error("Error fetching user money:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginData),
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsLoggedIn(true);
        setMessage("Logged in successfully!");
        setLoginData({ username: "", password: "" });
      } else {
        const error = await response.text();
        setMessage(`Login failed: ${error}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Login failed. Please try again.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      if (response.ok) {
        const result = await response.text();
        setMessage(`Registration successful! ${result}`);
        setRegisterData({ username: "", password: "" });
        setShowRegister(false);
      } else {
        const error = await response.text();
        setMessage(`Registration failed: ${error}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Registration failed. Please try again.");
    }
  };

  const handleInputChange = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  const handleAddHabit = async (index) => {
    const habitText = inputValues[index].trim();
    if (!habitText) return;

    try {
      const response = await fetch("/createHabit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: habitText }),
      });
      if (response.ok) {
        const newHabit = await response.json();
        setHabits(prev => [...prev, newHabit]);
        const newInputValues = [...inputValues];
        newInputValues[index] = "";
        setInputValues(newInputValues);
        setMessage("Habit added successfully!");
      } else {
        const error = await response.text();
        setMessage(`Failed to add habit: ${error}`);
      }
    } catch (error) {
      console.error("Error creating habit:", error);
      setMessage("Error creating habit. Please try again.");
    }
  };

  const handleCompleteHabit = async (habitId) => {
    try {
      const response = await fetch("/completeHabit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ habitId }),
      });
      if (response.ok) {
        const result = await response.json();
        setMessage(result.message);
        // Refresh habits and money
        await Promise.all([fetchUserMoney(), fetchUserHabits()]);
      } else {
        const error = await response.text();
        setMessage(`Failed to complete habit: ${error}`);
      }
    } catch (error) {
      console.error("Error completing habit:", error);
      setMessage("Error completing habit. Please try again.");
    }
  };

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  if (!isLoggedIn) {
    navigate("/");
  //   return (
  //     <div className="dashboard-container">
  //       <div className="dashboard-header">
  //         <h1 className="title">Welcome to Habits</h1>
  //         {message && <div className="message">{message}</div>}
  //         {!showRegister ? (
  //           <form onSubmit={handleLogin}>
  //             <div className="form-group">
  //               <input
  //                 type="text"
  //                 className="form-control"
  //                 placeholder="Username"
  //                 value={loginData.username}
  //                 onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
  //                 required
  //               />
  //             </div>
  //             <div className="form-group">
  //               <input
  //                 type="password"
  //                 className="form-control"
  //                 placeholder="Password"
  //                 value={loginData.password}
  //                 onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
  //                 required
  //               />
  //             </div>
  //             <button type="submit" className="btn btn--primary btn--full-width">
  //               Login
  //             </button>
  //             <button
  //               type="button"
  //               className="btn btn--secondary btn--full-width mt-8"
  //               onClick={() => setShowRegister(true)}
  //             >
  //               Register
  //             </button>
  //           </form>
  //         ) : (
  //           <form onSubmit={handleRegister}>
  //             <div className="form-group">
  //               <input
  //                 type="text"
  //                 className="form-control"
  //                 placeholder="Username"
  //                 value={registerData.username}
  //                 onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
  //                 required
  //               />
  //             </div>
  //             <div className="form-group">
  //               <input
  //                 type="password"
  //                 className="form-control"
  //                 placeholder="Password"
  //                 value={registerData.password}
  //                 onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
  //                 required
  //               />
  //             </div>
  //             <button type="submit" className="btn btn--primary btn--full-width">
  //               Register
  //             </button>
  //             <button
  //               type="button"
  //               className="btn btn--secondary btn--full-width mt-8"
  //               onClick={() => setShowRegister(false)}
  //             >
  //               Back to Login
  //             </button>
  //           </form>
  //         )}
  //       </div>
  //     </div>
  //   );
  }

  // // Create array of 4 slots for habits
  const habitSlots = [];
  for (let i = 0; i < 4; i++) {
    const habit = habits[i];
    if (habit) {
      habitSlots.push({
        type: 'habit',
        habit: habit,
        index: i
      });
    } else {
      habitSlots.push({
        type: 'input',
        index: i
      });
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="title">Habits</h1>
        <p className="subtitle">Keep up the good habits!</p>
        <div className="score-display">
          <span className="score-label">Total Pulls:</span>
          <span className="score-value">{totalPulls}</span>
        </div>
      </div>

      {message && <div className="message">{message}</div>}

      <div className="habits-container">
        {habitSlots.map((slot, index) => (
          <div
            key={index}
            className={`habit-item ${
              slot.type === 'habit' && slot.habit.is_completed ? 'completed' : ''
            }`}
          >
            {slot.type === 'habit' ? (
              <>
                <div className="habit-content">
                  <span className="habit-text">{slot.habit.name}</span>
                  <span className="habit-points">+3 pulls</span>
                </div>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    className="hidden-checkbox"
                    checked={slot.habit.is_completed}
                    disabled={slot.habit.is_completed}
                    onChange={() => !slot.habit.is_completed && handleCompleteHabit(slot.habit.id)}
                  />
                  <span className="custom-checkbox"></span>
                </label>
              </>
            ) : (
              <>
                <div className="habit-input-container">
                  <input
                    type="text"
                    className="habit-input"
                    placeholder="Add a habit here. Habits cannot be changed after creation!"
                    value={inputValues[index]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    maxLength={80}
                  />
                </div>
                <button
                  className="add-habit-button"
                  onClick={() => handleAddHabit(index)}
                  disabled={!inputValues[index].trim()}
                >
                  Add
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Habits;