import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [totalPulls, setTotalPulls] = useState(0); // Changed from totalScore to totalPulls (int)
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Authentication state
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
  });
  const [showRegister, setShowRegister] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Fetch all user data when logged in
useEffect(() => {
  const fetchData = async () => {
    if (isLoggedIn) {
      await Promise.all([fetchUserMoney(), fetchUserTasks()]);
    }
  };
  fetchData();
}, [isLoggedIn]);

  // Fetch data on component mount if already logged in
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     fetchUserMoney();
  //   }
  // }, []); // Empty dependency array means it runs on every mount

  // Add window focus event listener to refetch data
  useEffect(() => {
    const handleFocus = () => {
      if (isLoggedIn) {
        fetchUserMoney();
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
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isLoggedIn]);


  const fetchUserTasks = async () => {
    try {
      const response = await fetch("/getUserTasks", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setTasks(data.tasks.map(task => ({
          ...task,
          state: 'visible',
          points: task.points // points from DB are already 0-1
        })));
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
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
        console.log("Fetched user money:", data.money);
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
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.username);
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
        headers: {
          "Content-Type": "application/json",
        },
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

  const generateRandomPoints = () => Math.random(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      const response = await fetch("/createTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: inputValue.trim(),
          probability: Math.random()
        }),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks(prev => [...prev, {...newTask, state: 'entering'}]);
        setInputValue("");
        
        setTimeout(() => {
          setTasks(prev => prev.map(t => 
            t.id === newTask.id ? {...t, state: 'visible'} : t
          ));
        }, 10);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleComplete = async (id) => {
    const completedTask = tasks.find((t) => t.id === id);
    if (!completedTask) return;

    // Mark task as exiting
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, state: "exiting" } : t))
    );

    try {
      // Send probability to backend to determine if user gets a pull
      const response = await fetch("/completeTask", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ probability: completedTask.points, id: id }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message);
        
        // If user earned a pull, refresh the total pulls from database
        if (result.earnedPull) {
          // Instead of just incrementing, fetch fresh data from database
          await fetchUserMoney();
        }
      } else {
        console.error("Failed to complete task");
        setMessage("Failed to complete task. Please try again.");
      }
    } catch (error) {
      console.error("Error completing task:", error);
      setMessage("Error completing task. Please try again.");
    }

    // Remove task after animation completes
    setTimeout(() => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  };

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    navigate("/");
    // return (
    //   <div className="dashboard-container">
    //     <div className="auth-container">
    //       {message && <div className="message">{message}</div>}
          
    //       {!showRegister ? (
    //         <form onSubmit={handleLogin} className="auth-form">
    //           <h2>Login</h2>
    //           <input
    //             type="text"
    //             placeholder="Username"
    //             value={loginData.username}
    //             onChange={(e) =>
    //               setLoginData({ ...loginData, username: e.target.value })
    //             }
    //             className="auth-input"
    //             required
    //           />
    //           <input
    //             type="password"
    //             placeholder="Password"
    //             value={loginData.password}
    //             onChange={(e) =>
    //               setLoginData({ ...loginData, password: e.target.value })
    //             }
    //             className="auth-input"
    //             required
    //           />
    //           <button type="submit" className="auth-button">
    //             Login
    //           </button>
    //           <p>
    //             Don't have an account?{" "}
    //             <button
    //               type="button"
    //               onClick={() => setShowRegister(true)}
    //               className="link-button"
    //             >
    //               Register here
    //             </button>
    //           </p>
    //         </form>
    //       ) : (
    //         <form onSubmit={handleRegister} className="auth-form">
    //           <h2>Register</h2>
    //           <input
    //             type="text"
    //             placeholder="Username"
    //             value={registerData.username}
    //             onChange={(e) =>
    //               setRegisterData({ ...registerData, username: e.target.value })
    //             }
    //             className="auth-input"
    //             required
    //           />
    //           <input
    //             type="password"
    //             placeholder="Password"
    //             value={registerData.password}
    //             onChange={(e) =>
    //               setRegisterData({ ...registerData, password: e.target.value })
    //             }
    //             className="auth-input"
    //             required
    //           />
    //           <button type="submit" className="auth-button">
    //             Register
    //           </button>
    //           <p>
    //             Already have an account?{" "}
    //             <button
    //               type="button"
    //               onClick={() => setShowRegister(false)}
    //               className="link-button"
    //             >
    //               Login here
    //             </button>
    //           </p>
    //         </form>
    //       )}
    //     </div>
    //   </div>
    // );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="title">Tasks</h1>
        <div className="user-info">
          <span>Welcome, {user}!</span>
        </div>
        <div className="score-display">
          <span className="score-label">Total Pulls:</span>
          <span className="score-value">{totalPulls}</span>
        </div>
      </header>

      {message && <div className="message">{message}</div>}

      <form onSubmit={handleSubmit} className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter new task..."
          className="task-input"
          maxLength={60}
        />
        <button type="submit" className="add-button">
          Add Task
        </button>
      </form>

      <div className="tasks-container">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks yet. Add one above to get started!</p>
            <p>Complete tasks to have a chance at earning pulls!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className={`task-item ${task.state}`}>
              <div className="task-content">
                <span className="task-text">{task.text}</span>
              </div>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  onChange={() => handleComplete(task.id)}
                  className="hidden-checkbox"
                />
                <span className="custom-checkbox"></span>
              </label>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;