import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import { useNavigate } from "react-router-dom";
import { UserInfo } from "./types/User";
import "./Report.css";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const BASE_URL = "https://hackathon-backend-n7qi3ktvya-uc.a.run.app";

type ContributionReport = {
    user_id: string
    name: string
    contribution_sent: number
    points_sent: number
    reaction_sent: number
    contribution_received: number
    points_received: number
    reaction_received: number
}

function Report() {

    const navigate = useNavigate();
    const didEffect = useRef(false);
    const [ userId, setUserId ] = useState("");
    const [ contributionReport, setContributionReport ] = useState<ContributionReport[]>([]);

    const accessToken = sessionStorage.getItem("authentication");
    const workspaceId = sessionStorage.getItem("workspace_id");

    const fetchUserInfo = () => {
        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/api/me`,
            method: "GET",
            headers: {
                'authentication': accessToken,
                'workspace_id': workspaceId
            },
        };

        axios(options)
            .then((res: AxiosResponse<UserInfo>) => {
                setUserId(res.data.user_id);
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                navigate("/main");
                return;
            });
    };

    const fetchContributionReport = () => {
        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/api/contribution/report`,
            method: "GET",
            headers: {
                'authentication': accessToken,
                'workspace_id': workspaceId
            },
        };

        axios(options)
            .then((res: AxiosResponse<ContributionReport[]>) => {
                for (let i = 0; i < res.data.length; i++) {
                    setContributionReport((report) => [...report, {
                        user_id: res.data[i].user_id,
                        name: res.data[i].name,
                        contribution_sent: res.data[i].contribution_sent,
                        points_sent: res.data[i].points_sent,
                        reaction_sent: res.data[i].reaction_sent,
                        contribution_received: res.data[i].contribution_received,
                        points_received: res.data[i].points_received,
                        reaction_received: res.data[i].reaction_received
                    }])
                }
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                navigate("/main");
                return;
            });
    };

    useEffect(() => {
        if (!didEffect.current){
            didEffect.current = true;

            if (accessToken === null || workspaceId === null) {
                console.log("authentication failed");
                navigate("/login");
                return;
            };

            fetchUserInfo();
            fetchContributionReport();
        }
    }, []);

    return(
        <div className="main">
            <Sidebar />
            <Header 
                title={"週間レポート"}
            />
            <div className="report-container">
                <div className="report-div">
                    {contributionReport.map((report) => {
                        if (report.user_id === userId) {
                            return (
                                <div>{report.contribution_sent},{report.points_sent},{report.reaction_sent},{report.contribution_received},{report.points_received},{report.reaction_received}</div>
                            ); 
                        };
                    })}
                </div>
                <ul className="report-ul">
                    {contributionReport.map((report) => {
                        return (
                            <li id={report.user_id}>
                                <div>{report.name},{report.contribution_received},{report.points_received},{report.reaction_received}</div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    )
}

export default Report;