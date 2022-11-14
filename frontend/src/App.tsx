import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import Signup from "./Signup/Signup";
import Login from "./Login/Login";
import Workspaces from "./Workspaces/Workspaces";
import CreateWorkspace from "./Workspaces/CreateWorkspace";
import Main from "./Main/Main";
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path="/signup" element={<Signup />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/workspaces" element={<Workspaces />}/>
          <Route path="/workspaces/create" element={<CreateWorkspace />}/>
          <Route path="/main" element={<Main />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
