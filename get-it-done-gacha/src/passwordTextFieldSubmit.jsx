import React, { useState } from 'react';

export default function PasswordTextFieldSubmit({numFields = 2, onSubmit, fieldPlaceholders = []}) {
    const[text, setText] = useState(Array(numFields).fill(''));
    const types = ["text", "password"]; // the first field is plaintext, and the others are concealed as dots

    // updates arguments array text when any field (given by index) is edited
    const handleChange = (index, event) => {
        const newText = [...text];
        newText[index] = event.target.value;
        setText(newText);
    }

    // when the form is submitted, don't refresh
    // and take action (whatever was passed in through onSubmit)
    const handleSubmit = (e) => {
        console.log("submitting: " + text[0]);
        e.preventDefault();
        
        onSubmit(text);
        setText(Array(numFields).fill(''));
    };

    return (
        <form style={{width: '50%'}} onSubmit={handleSubmit} className="flex flex-col gap-2 p-4">
            {text.map((fieldValue, index) => (
                <input 
                    key = {index}
                    type = {types[Math.min(index, 1)]}
                    value = {fieldValue}
                    onChange = {(e) => handleChange(index, e)}
                    placeholder = {fieldPlaceholders[index] || `Field ${index + 1}`}
                    className = "p-2 border border-gray-300 rounded-md w-full mb-4"
                />
            ))}
            <button 
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
                Submit
            </button>
        </form>
    );
}

