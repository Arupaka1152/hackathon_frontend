import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import "./UserSettings.css";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { sidebarProps } from "./components/Sidebar/Sidebar";

function UserSettings() {

    const location = useLocation();
    const workspaceState = location.state as sidebarProps;

    return(
        <div className="main">
            <Sidebar 
                role={workspaceState.role}
                workspaceName={workspaceState.workspaceName}
            />
        </div>
    )
}

export default UserSettings;