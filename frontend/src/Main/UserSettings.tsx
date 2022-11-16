import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import { useNavigate, useLocation } from "react-router-dom";
import "./UserSettings.css";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { sidebarProps } from "./components/Sidebar/Sidebar";
import { UserInfo } from "./types/User";

const BASE_URL = "https://hackathon-backend-n7qi3ktvya-uc.a.run.app";

type UpdateUserInfoRes = {
    user_name: string
    description: string
}

function UserSettings() {

    const navigate = useNavigate();
    const location = useLocation();
    const workspaceState = location.state as sidebarProps;
    const didEffect = useRef(false);
    const [ name, setName ] = useState("");
    const [ description, setDescription ] = useState("");

    const accessToken = sessionStorage.getItem("authentication");
    const workspaceId = sessionStorage.getItem("workspace_id");

    const fetchUserInfo = () => {
        if (accessToken === null || workspaceId === null) {
            console.log("authentication failed");
            navigate("/login");
            return;
        };

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
                setName(res.data.name);
                setDescription(res.data.description);
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                navigate("/main");
                return;
            });
    }

    const updateUserInfo = (name: string, description: string) => {
        if (accessToken === null || workspaceId === null) {
            console.log("authentication failed");
            navigate("/login");
            return;
        };

        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/api/user`,
            method: "PUT",
            headers: {
                'authentication': accessToken,
                'workspace_id': workspaceId
            },
            data: {
                user_name: name,
                description: description,
            },
        };

        axios(options)
            .then((res: AxiosResponse<UpdateUserInfoRes>) => {
                setName(res.data.user_name);
                setDescription(res.data.description);
                alert("ユーザー情報を変更しました。");
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                navigate("/main");
                return;
            });
    }

    const leaveWorkspace = () => {
        if (accessToken === null || workspaceId === null) {
            console.log("authentication failed");
            navigate("/login");
            return;
        };

        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/api/user`,
            method: "DELETE",
            headers: {
                'authentication': accessToken,
                'workspace_id': workspaceId,
            },
        };

        axios(options)
            .then(() => {
                sessionStorage.removeItem('workspace_id');
                navigate("/workspaces");
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                navigate("/main");
                return;
            });
    }

    useEffect(() => {
        if (!didEffect.current){
            didEffect.current = true;

            fetchUserInfo();
        }
    }, []);

    const onSubmitUserSettings = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        updateUserInfo(name, description);
        e.preventDefault();
    };

    const onSubmitLeaveWorkspace = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        leaveWorkspace();
        e.preventDefault();
    }; 

    return(
        <div className="main">
            <Sidebar 
                role={workspaceState.role}
                workspaceName={workspaceState.workspaceName}
            />
            <Header 
                title={"ユーザー設定"}
            />
            <div className="user-settings-container">
                <form className="user-settings-form">
                    <div className="user-settings-title">ユーザー情報を変更</div>
                    <div className="input-container ic1">
                        <input
                            className="user-settings-input"
                            type="text"
                            value={name}
                            placeholder={name}
                            onChange={(e) => setName(e.target.value)}
                        ></input>
                    </div>
                    <div className="input-container ic2">
                        <input
                            className="user-settings-input"
                            type="text"
                            value={description}
                            placeholder={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></input>
                    </div>
                    <button 
                        className="user-settings-button"
                        type="submit"
                        onClick={onSubmitUserSettings}
                    >変更</button>
                </form>
                <div className="user-leave-title">ワークスペースから退出</div>
                <button 
                    className="user-leave-button"
                    type="submit"
                    onClick={onSubmitLeaveWorkspace}
                >退出</button>
            </div>
        </div>
    )
}

export default UserSettings;