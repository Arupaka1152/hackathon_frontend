import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import { useNavigate, useLocation } from "react-router-dom";
import "./WorkspaceSettings.css";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { sidebarProps } from "./components/Sidebar/Sidebar";

function WorkspaceSettings() {

    const navigate = useNavigate();
    const location = useLocation();
    const workspaceState = location.state as sidebarProps;
    const didEffect = useRef(false);

    const accessToken = sessionStorage.getItem("authentication");
    const workspaceId = sessionStorage.getItem("workspace_id");

    useEffect(() => {
        if (!didEffect.current){
            didEffect.current = true;

            
        }
    }, []);

    return(
        <div className="main">
            <Sidebar 
                role={workspaceState.role}
                workspaceName={workspaceState.workspaceName}
            />
            <Header 
                title={"ワークスペース設定"}
            />
            <div className="workspace-settings-container">

            </div>
        </div>
    )
}

export default WorkspaceSettings;