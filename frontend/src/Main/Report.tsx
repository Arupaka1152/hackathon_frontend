import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import { User } from "./types/User";
import { useNavigate } from "react-router-dom";
import { Contribution } from "./types/Contribution";
import "./Report.css";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const BASE_URL = "https://hackathon-backend-n7qi3ktvya-uc.a.run.app";

type contributionInfo = {
    user_id: string
    points: number
    reactions: number
}

function Report() {

    const navigate = useNavigate();
    const didEffect = useRef(false);
    const [ users, setUsers ] = useState<User[]>([]);
    const [ contributions, setContributions ] = useState<Contribution[]>([]);
    const [ sentContributions, setSentContributions ] = useState<Contribution[]>([]);
    const [ receivedContributions, setReceivedContributions ] = useState<Contribution[]>([]);
    const [ contributionInfo, setContributionInfo ] = useState<contributionInfo[]>([]);
    const [ sentPoints, setSentPoints ] = useState(0);
    const [ sentReactions, setSentReactions ] = useState(0);
    const [ receivedPoints, setReceivedPoints ] = useState(0);
    const [ receivedReactions, setReceivedReactions ] = useState(0);

    const accessToken = sessionStorage.getItem("authentication");
    const workspaceId = sessionStorage.getItem("workspace_id");

    const fetchAllUsersInWorkspace = () => {
        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/api/workspace/member`,
            method: "GET",
            headers: {
                'authentication': accessToken,
                'workspace_id': workspaceId
            },
        };

        axios(options)
            .then((res: AxiosResponse<User[]>) => {
                for (let i = 0; i < res.data.length; i++) {
                    setUsers((users) => [...users, { 
                        user_id: res.data[i].user_id,
                        name: res.data[i].name,
                        account_id: res.data[i].account_id,
                        workspace_id: res.data[i].workspace_id,
                        role: res.data[i].role,
                        description: res.data[i].description,
                        avatar_url: res.data[i].avatar_url,
                    }])
                }
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                navigate("/main");
                return;
            });
    };

    const fetchContributions = () => {
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

    const fetchContributionSent = () => {
        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/api/contribution/sent`,
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
                        setSentContributions((contributions) => [...contributions, { 
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

    const fetchContributionReceived = () => {
        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/api/contribution/received`,
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
                        setReceivedContributions((contributions) => [...contributions, { 
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

    const calcContributions = () => {
        users.map((user) => {
            const targetContributions = contributions.filter((contribution) => {
                return (
                    contribution.receiver_id === user.user_id
                );
            });
            console.log(targetContributions);
            let points = 0;
            let reactions = 0;
            for (const contribution of targetContributions) {
                points += contribution.points;
                reactions += contribution.reaction;
            }
            if (targetContributions !== undefined) {
                setContributionInfo((contributionInfo) => [...contributionInfo, {
                    user_id: user.user_id,
                    points: points,
                    reactions: reactions,
                }]);
            }
        })

        for (const contribution of sentContributions) {
            setSentPoints(sentPoints + contribution.points);
            setSentReactions(sentReactions + contribution.reaction);
        }

        for (const contribution of receivedContributions) {
            setReceivedPoints(receivedPoints + contribution.points)
            setReceivedReactions(receivedReactions + contribution.reaction);
        }
    }

    useEffect(() => {
        if (!didEffect.current){
            didEffect.current = true;

            if (accessToken === null || workspaceId === null) {
                console.log("authentication failed");
                navigate("/login");
                return;
            };

            fetchAllUsersInWorkspace();
            fetchContributions();
            fetchContributionSent();
            fetchContributionReceived();
            calcContributions();
            console.log(users)
        }
    }, []);

    return(
        <div className="main">
            <Sidebar />
            <Header 
                title={"週間レポート"}
            />
            <div className="report-container">
                <div className="report-div">{sentPoints},{sentReactions},{receivedPoints},{receivedReactions}</div>
                <ul className="report-ul">
                    {contributionInfo.map((user) => {
                        return (
                            <li>
                                <div>{user.user_id},ポイント:{user.points},リアクション:{user.reactions}</div>
                            </li>
                        );
                    })}
                    {users.map((user) => {
                        return (
                            <li>
                                <div>{user.user_id},ポイント:{user.name},リアクション:{user.role}</div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    )
}

export default Report;