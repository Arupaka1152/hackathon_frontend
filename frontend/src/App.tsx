import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import Signup from "./Signup/Signup";
import Login from "./Login/Login";
import Workspaces from "./Workspaces/Workspaces";
import CreateWorkspace from "./Workspaces/CreateWorkspace";
import Main from "./Main/Main";
import Report from "./Main/Report";
import Members from './Main/Members';
import UserSettings from './Main/UserSettings';
import WorkspaceSettings from './Main/WorkspaceSettings';
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
          <Route path="/main/report" element={<Report />}/>
          <Route path="/main/members" element={<Members />}/>
          <Route path="/main/user-settings" element={<UserSettings />}/>
          <Route path="/main/workspace-settings" element={<WorkspaceSettings />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
