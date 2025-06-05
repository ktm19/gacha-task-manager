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

import React, { useState, useEffect } from 'react';
import '../App.css' 
import { Link, useNavigate } from 'react-router-dom';

function Info() {
  const navigate = useNavigate();

  return (
    <div className = "p-4 justify-center items-center flex flex-col h-screen bg-gray-100">
      <h1 className = "text-xl font-bold mb-4"> Welcome, CS 35L Traveler! </h1>
      <div style={{marginTop: '10px'}} className="mt-4">
        <p>Ever wanted to replace all of your bad habits with one, singular bad habit?</p>
        <p>Well, now you can! Set daily tasks and long term habits for yourself,</p>
        <p>complete them, and earn gacha pulls. Legendary rewards await you!</p>
        <div><img src="banner2.png" width="600" height="auto" border-radius="15px"/></div>
        <p>
          <Link
            to="/dashboard"
          >
            <button style={{ marginRight: '1em', 'background-color': "#662d2d", 'color': "#f5efe0"}}>Let's begin!</button>
          </Link>
          
        </p>
      </div>
    </div>
  );
}

export default Info


