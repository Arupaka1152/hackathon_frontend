import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ContributionSent.css";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { Contribution } from "./types/Contribution";
import { User } from "./types/User";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import EditContribution from "./components/EditContribution/EditContribution";
import TimelineForSent from "./components/TimelineForSent/TimelineForSent";

const BASE_URL = "https://hackathon-backend-n7qi3ktvya-uc.a.run.app";

export type ContributionContent = {
    contribution_id: string;
    points: number;
    message: string;
}

function ContributionSent() {

    const navigate = useNavigate();
    const didEffect = useRef(false);
    const [ contributions, setContributions ] = useState<Contribution[]>([]);
    const [ targetContributionContent, setTargetContributionContent ] = useState<ContributionContent>({
        contribution_id: "",
        points: 1,
        message: "",
    });
    const [ members, setMembers ] = useState<User[]>([]);

    const accessToken = sessionStorage.getItem("authentication");
    const workspaceId = sessionStorage.getItem("workspace_id");

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
                    setMembers((users) => [...users, { 
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

    useEffect(() => {
        if (!didEffect.current){
            didEffect.current = true;

            if (accessToken === null || workspaceId === null) {
                console.log("authentication failed");
                navigate("/login");
                return;
            };

            fetchContributionSent();
            fetchAllUsersInWorkspace();
        }
    }, []);

    return(
        <div className="main">
            <Sidebar />
            <Header 
                title={"送信履歴"}
            />
            <div className="ContributionSent-container">
                <div className="timeline-container">
                    <TimelineForSent
                        contributions={contributions}
                        setContributions={setContributions}
                        members={members}
                        targetContributionContent={targetContributionContent}
                        setTargetContributionContent={setTargetContributionContent}
                    />
                </div>
                <div className="postContribution-container">
                    <EditContribution
                        contributions={contributions}
                        setContributions={setContributions}
                        members={members}
                        targetContributionContent={targetContributionContent}
                        setTargetContributionContent={setTargetContributionContent}
                    />
                </div>
            </div>
        </div>
    );
}

export default ContributionSent;