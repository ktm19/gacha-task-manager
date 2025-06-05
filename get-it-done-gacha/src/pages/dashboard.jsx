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

  // authentication state
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
  });
  const [showRegister, setShowRegister] = useState(false);

  // is user logged in?
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // fetch all user data when logged in
useEffect(() => {
  const fetchData = async () => {
    if (isLoggedIn) {
      await Promise.all([fetchUserMoney(), fetchUserTasks()]);
    }
  };
  fetchData();
}, [isLoggedIn]);

  // focus event listener
  useEffect(() => {
    const handleFocus = () => {
      if (isLoggedIn) {
        fetchUserMoney();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isLoggedIn]);

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
        // console.log(data);
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
        // console.log("Fetched user money:", data.money);
      } else {
        console.error("Failed to fetch user money");
      }
    } catch (error) {
      console.error("Error fetching user money:", error);
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

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, state: "exiting" } : t))
    );

    try {
      // send probability to backend to determine if user gets a pull
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
        
        // if user earned a pull, refresh the total pulls from database
        if (result.earnedPull) {
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

    // remove task
    setTimeout(() => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  };

  // message (3 seconds)
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