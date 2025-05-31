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


import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Gacha from './pages/gacha.jsx';
import SearchForFriend from './pages/searchforfriend.jsx';
import Profile from './pages/profile.jsx';
import Directory from './pages/directory.jsx';
import Layout from './components/Layout/layout';
import ProtectedRoute from './components/ProtectedRoute';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;

function App() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('/status').then(response => {
            setUsers(response.data);
        });
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/searchforfriend" element={<SearchForFriend />} />
                <Route path="/directory" element={<Directory />} />
                
                {/* Protected Routes with Navigation Bar */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Layout>
                            <Profile />
                        </Layout>
                    </ProtectedRoute>
                } />
                <Route path="/gacha" element={
                    <ProtectedRoute>
                        <Layout>
                            <Gacha />
                        </Layout>
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;



