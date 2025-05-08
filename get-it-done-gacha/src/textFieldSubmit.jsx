import React, { useState } from 'react';

export default function textFieldSubmit() {
    const[text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Submitted: ${text}');
        setText('');
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10">
            <input 
                type = "text"
                value = {text}
                onChange={(e) => setText(e.target.value)}
                placeholder = "Type here..."
                className = "p-2 border border-gray-300 rounded-md w-full mb-4"
            />
            <button 
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
                Submit
            </button>
        </form>
    );
}