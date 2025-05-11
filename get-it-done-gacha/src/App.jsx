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
