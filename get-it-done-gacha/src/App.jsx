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

import React from 'react';
import { useState } from 'react'
import './App.css'
import TextFieldSubmit from './textFieldSubmit';

function App() {
  return (
    <div className = "p-4 justify-center items-center flex flex-col h-screen bg-gray-100">
      <h1 className = "text-xl font-bold mb-4"> Login </h1>
      <TextFieldSubmit 
        numFields={2} 
        onSubmit={(values) => alert(`Submitted`)} 
        fieldPlaceholders={['Username', 'Password']}
      />
    </div>
  );
}
export default App
