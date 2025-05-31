import React, { useState } from 'react';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [totalScore, setTotalScore] = useState(0);

  const generateRandomPoints = () => Math.floor(Math.random() * 10) / 100;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask = {
      id: Date.now(),
      text: inputValue.trim(),
      points: generateRandomPoints(),
      state: 'entering'
    };

    setTasks(prev => [...prev, newTask]);
    setInputValue('');

    setTimeout(() => {
      setTasks(prev => prev.map(t => 
        t.id === newTask.id ? {...t, state: 'visible'} : t
      ));
    }, 10);
  };

  const handleComplete = (id) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? {...t, state: 'exiting'} : t
    ));
    
    setTimeout(() => {
      const completedTask = tasks.find(t => t.id === id);
      setTotalScore(prev => prev + completedTask.points);
      setTasks(prev => prev.filter(t => t.id !== id));
    }, 300);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="title">Tasks</h1>
        <div className="score-display">
          <span className="score-label">Total Pulls:</span>
          <span className="score-value">{totalScore.toFixed(2)}</span>
        </div>
      </header>

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
        {tasks.map(task => (
          <div 
            key={task.id}
            className={`task-item ${task.state}`}
          >
            <div className="task-content">
              <span className="task-text">{task.text}</span>
              <span className="task-points">{task.points.toFixed(2)}</span>
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
        ))}
      </div>
    </div>
  );
};

export default Dashboard;