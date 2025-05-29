import { useState } from 'react';
import './Dashboard.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('tasks');

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <h1>DASHBOARD</h1>
      </div>

      {/* Content Section */}
      <div className="dashboard-content">
        <div className="window-container">
          {/* Tab Buttons */}
          <div className="tabs-bar">
            <button
              onClick={() => setActiveTab('tasks')}
              className={activeTab === 'tasks' ? 'active-tab' : ''}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveTab('habits')}
              className={activeTab === 'habits' ? 'active-tab' : ''}
            >
              Habits
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'tasks' ? (
              <div className="tasks-tab">
                <div className="input-button-container">
                    <input 
                    type="text" 
                    className="task-input-field" 
                    placeholder="Enter task" 
                    />
                    <button className="boom-button">boom</button>
                </div>
                <div className="tasks-list">
                    <Task text="text1eeeeeeeeeeeeeeeee" reward={1.0} />
                    <Task text="text2" reward={2.0} />
                    <Task text="text3" reward={3.0} />
                </div>
              </div>
            ) : (
              <div className="habits-tab">
                <h2>Habit Tracker</h2>
                <div className="habits-grid">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="habit-placeholder">
                      <div className="placeholder-line"></div>
                      <div className="placeholder-line-short"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


function Task({ text, reward }) {

  return (
    <div className="task-container">
      <div className="task-content">
        <button className="task-checkbox"></button>
        <div className="multi-line-text">{text}</div>
        <div className="reward-section">
          <div className="reward-text">{reward}</div>
        </div>
      </div>
    </div>
  );
}


