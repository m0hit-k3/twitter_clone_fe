import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Tweet from "./Components/Tweet/Tweet";
import AllUsers from "./Components/User/AllUsers";
import Signup from "./Components/User/SignUp";
import UserProfile from "./Components/User/UserProfile"; // Import the UserProfile component

import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tweet" element={<Tweet />} />
          <Route path="/users" element={<AllUsers />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;