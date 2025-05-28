
import React, { useState } from 'react';
//import { useState } from 'react'
//in a new dir, make sure to go up 1 more level
import '../App.css' 
import TextFieldSubmit from '../textFieldSubmit.jsx';
import { Link } from 'react-router-dom';
import { prerenderToNodeStream } from 'react-dom/static';

function Dashboard() {
    const [task, setTask] = useState([
        { text: "Write a task here", done: false}
    ]);

    const [newTask, setNewTask] = useState("");

    const handleAddTask = (e) => {
        e.preventDefault();
        if (newTask.trim() === "") return;
        setTask([...task, { text: newTask, done: false }]);
        setNewTask("");
    }

    const handleToggleTask = (i) => {
        const newTasks = [...task];
        newTasks[i].done = !newTasks[i].done;
        setTask(newTasks);
    }

    const handleDeleteTask = (i) => {
        const newTasks = [...task];
        newTasks.splice(i, 1);
        setTask(newTasks);
    }

    return(
        <div className="min-h-screen flex flex-col items-center justify-center">
            {/*TO-DO BOARD*/}
            <div className="bg-yellow-100 p-6 rounded-xl shadow-lg border-4 border-dashed border-yellow-300 rotate-[2-deg]">
                <h2 className="text-2xl font-bold mb-4">To-Do Board</h2>
                <form onSubmit={handleAddTask} className="flex flex-col gap-2">
                    <input 
                        type="text" 
                        value={newTask} 
                        onChange={(e) => setNewTask(e.target.value)} 
                        placeholder="Add a new task" 
                        className="p-2 border border-gray-300 rounded-md mb-4"
                    />
                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Add Task
                    </button>
                </form>
            
                {task.map((task, i) => (
                    <div 
                        key={i} 
                        className={`flex items-center justify-between p-2 border-b ${
                            task.done ? "line-through text-gray-400" : "bg-white"
                        }`}
                    >
                        <span 
                            onClick={() => handleToggleTask(i)} 
                            className="cursor-pointer"
                        >
                            {task.text}
                        </span>
                        <button 
                            onClick={() => handleDeleteTask(i)} 
                            className="text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
            {/*END TO-DO BOARD*/}
        </div>
    );
}

export default Dashboard;
