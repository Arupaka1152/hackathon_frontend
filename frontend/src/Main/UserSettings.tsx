import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import { useNavigate } from "react-router-dom";
import "./UserSettings.css";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { UserInfo } from "./types/User";

const BASE_URL = "https://hackathon-backend-n7qi3ktvya-uc.a.run.app";

type UpdateUserInfoRes = {
    user_name: string
    description: string
}

function UserSettings() {

    const navigate = useNavigate();
    const didEffect = useRef(false);
    const [ name, setName ] = useState("");
    const [ description, setDescription ] = useState("");

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
                alert("??????????????????????????????????????????");
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                navigate("/main");
                return;
            });
    }

    const leaveWorkspace = () => {
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
                alert("?????????????????????????????????????????????");
                navigate("/workspaces");
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                alert("?????????????????????????????????????????????????????????");
                navigate("/main");
                return;
            });
    }

    useEffect(() => {
        if (!didEffect.current){
            didEffect.current = true;

            if (accessToken === null || workspaceId === null) {
                console.log("authentication failed");
                navigate("/login");
                return;
            };

            fetchUserInfo();
        }
    }, []);

    const onSubmitUserSettings = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        updateUserInfo(name, description);
        e.preventDefault();
    };

    const onSubmitLeaveWorkspace = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const result = window.confirm("??????????????????????????????????????????????????????");
        if (result) {
            leaveWorkspace();
        } else {
            alert("???????????????????????????????????????????????????????????????")
        }
        e.preventDefault();
    }; 

    return(
        <div className="main">
            <Sidebar />
            <Header 
                title={"??????????????????"}
            />
            <div className="user-settings-container">
                <div className="user-attribute-container">
                    <form className="user-settings-form">
                        <div className="user-settings-title"><h4>???????????????????????????</h4></div>
                        <div className="user-settings-input-container user-settings-ic1">
                            <p>???????????????</p> 
                            <input
                                className="user-settings-input"
                                type="text"
                                value={name}
                                placeholder={name}
                                onChange={(e) => setName(e.target.value)}
                            ></input>
                        </div>
                        <div className="user-settings-input-container user-settings-ic2">
                            <p>???????????????</p>
                            <textarea
                                className="user-settings-textarea"
                                value={description}
                                placeholder={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                        <button 
                            className="user-settings-button"
                            type="submit"
                            onClick={onSubmitUserSettings}
                        >??????</button>
                    </form>
                </div>
                <div className="user-leave-container">
                    <div className="user-leave-title"><h4>?????????????????????????????????</h4></div>
                        <button 
                            className="user-leave-button"
                            type="submit"
                            onClick={onSubmitLeaveWorkspace}
                        >??????</button>
                    </div>
                </div>
        </div>
    )
}

export default UserSettings;