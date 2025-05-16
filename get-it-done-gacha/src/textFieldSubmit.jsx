/* ==========================================================

File Description: 

This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.

========================================================== */

import React, { useState } from 'react';

export default function textFieldSubmit({numFields = 2, onSubmit, fieldPlaceholders = []}) {
    const[text, setText] = useState(Array(numFields).fill(''));

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4">
            {text.map((fieldValue, index) => (
                <input 
                    key={index}
                    type = "text"
                    value = {fieldValue}
                    onChange={(e) => handleChange(index, e)}
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