import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import { useNavigate } from "react-router-dom";
import { UserInfo } from "./types/User";
import { User } from "./types/User";
import "./Report.css";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const BASE_URL = "https://hackathon-backend-n7qi3ktvya-uc.a.run.app";

type ContributionReport = {
    user_id: string
    name: string
    avatar_url: string
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
                        avatar_url: res.data[i].avatar_url,
                        contribution_sent: res.data[i].contribution_sent,
                        points_sent: res.data[i].points_sent,
                        reaction_sent: res.data[i].reaction_sent,
                        contribution_received: res.data[i].contribution_received,
                        points_received: res.data[i].points_received,
                        reaction_received: res.data[i].reaction_received
                    }]);
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
                {contributionReport.map((report) => {
                    if (report.user_id === userId) {
                        return (
                            <div className="report-container-over">
                                <div className="report-container-left">
                                    <p className="report-title">受け取ったコントリビューション</p>
                                    <hr />
                                    <p className="report-content">コントリビューション数 :  {report.contribution_received}</p>
                                    <p className="report-content">ポイント : {report.points_received}</p>
                                    <p className="report-content">リアクション数 : {report.reaction_received}</p>
                                </div>
                                <div className="report-container-right">
                                    <p className="report-title">送ったコントリビューション</p>
                                    <hr />
                                    <p className="report-content">コントリビューション数 : {report.contribution_sent}</p>
                                    <p className="report-content">ポイント : {report.points_sent}</p>
                                    <p className="report-content">リアクション数 : {report.reaction_sent}</p>
                                </div>
                            </div>
                        ); 
                    };
                })}
                
                <div className="report-container-under">
                    <div className="report-table-title">メンバーが受け取ったコントリビューション</div>
                    <table className="report-table">
                        <thead className="report-thead">
                            <tr className="report-tr">
                                <th className="report-icon"></th>
                                <th className="report-user">ユーザー名</th>
                                <th className="report-contribution">コントリビューション数</th>
                                <th className="report-points">ポイント</th>
                                <th className="report-reaction">リアクション数</th>
                            </tr>
                        </thead>
                        <tbody className="report-body">
                            {contributionReport.map((report) => {
                                return (
                                    <tr>
                                        <th>
                                            <img 
                                                src={`${process.env.PUBLIC_URL}/${report.avatar_url}.png`}
                                                alt="" 
                                                className="member_icon"
                                            />
                                        </th>
                                        <th>{report.name}</th>
                                        <th>{report.contribution_received}</th>
                                        <th>{report.points_received}</th>
                                        <th>{report.reaction_received}</th>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Report;