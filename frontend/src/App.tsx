import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Workspaces from "./components/Workspaces/Workspaces"
import './App.css';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* <Route path='/' element={<Home />}/> */}
          <Route path="/signup" element={<Signup />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/workspaces" element={<Workspaces />}/>
          {/* <Route path="/main" element={<Main />}/> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
