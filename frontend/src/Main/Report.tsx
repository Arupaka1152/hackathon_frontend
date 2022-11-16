import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import { useNavigate } from "react-router-dom";
import "./Report.css";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

function Report() {

    const navigate = useNavigate();
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
            <Sidebar />
            <Header 
                title={"週間レポート"}
            />
            <div className="report-container">
                
            </div>
        </div>
    )
}

export default Report;