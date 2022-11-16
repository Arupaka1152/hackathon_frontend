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

    const navigate = useNavigate();
    const [ contributions, setContributions ] = useState<Contribution[]>([]);
    const didEffect = useRef(false);

    const accessToken = sessionStorage.getItem("authentication");
    const workspaceId = sessionStorage.getItem("workspace_id");

    const fetchContributions = () => {
        if (accessToken === null || workspaceId === null) {
            console.log("authentication failed");
            navigate("/login"); //404ページみたいなのにとばす
            return;
        };

        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/api/contribution`,
            method: "GET",
            headers: {
                'authentication': accessToken,
                'workspace_id': workspaceId
            },
        };

        axios(options)
            .then((res: AxiosResponse<Contribution[]>) => {
                if (res.data.length >= 1) {
                    for (let i = 0; i < res.data.length; i++) {
                        setContributions((contributions) => [...contributions, { 
                            contribution_id: res.data[i].contribution_id,
                            workspace_id: res.data[i].workspace_id,
                            sender_id: res.data[i].sender_id,
                            receiver_id: res.data[i].receiver_id,
                            points: res.data[i].points,
                            message: res.data[i].message,
                            reaction: res.data[i].reaction,
                            created_at: res.data[i].created_at,
                            update_at: res.data[i].update_at
                        }])
                    }
                }
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                return;
            });
    }

    useEffect(() => {
        if (!didEffect.current){
            didEffect.current = true;

            fetchContributions();
        }
    }, []);

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
