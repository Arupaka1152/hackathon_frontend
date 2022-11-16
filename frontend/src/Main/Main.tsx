import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
/* import Timeline from "./components/Timeline";
import PostContribution from "./components/PostContribution"; */
import { useNavigate } from "react-router-dom";
import "./Main.css";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { Contribution } from "./types/Contribution";

const BASE_URL = "https://hackathon-backend-n7qi3ktvya-uc.a.run.app";

function Main() {
    return (
        <div className="main">
            <Sidebar />
            <Header 
                title={"ホーム"}
            />
            <div className="main-container">

            </div>
        </div>
    )
}

export default Main;
