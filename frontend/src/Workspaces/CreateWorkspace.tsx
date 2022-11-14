import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CreateWorkspace.css";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { Workspace } from "./Workspaces"

const BASE_URL = "https://hackathon-backend-n7qi3ktvya-uc.a.run.app";

function CreateWorkspace() {
    const navigate = useNavigate();
    const [ workspaceName, setWorkspaceName ] = useState("");
    const [ userName, setUserName ] = useState("");

    const onClickCreateButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (workspaceName === "" || userName === "") {
            alert("未入力の項目があります。");
            return;
        }

        const accessToken = sessionStorage.getItem("authentication");
        if (accessToken === null) {
            console.log("accessToken not found");
            navigate("/login");
            return;
        };

        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/workspace`,
            method: "POST",
            headers: {
                'authentication': accessToken,
            },
            data: {
                workspace_name: workspaceName,
                user_name: userName,
            }
        };

        axios(options)
            .then((res: AxiosResponse<Workspace>) => {
                sessionStorage.setItem('workspace_id', res.data.id);
                navigate("/main");
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                navigate("/workspaces/create");
                return;
            });

        e.preventDefault();
    }

    return (
        <div className="createWorkspaces-body">
            <form className="createWorkspaces-form">
                <div className="createWorkspaces-title">ワークスペースを作成</div>
                <div className="input-container ic2">
                    <input
                        className="createWorkspaces-input"
                        type="text"
                        value={workspaceName}
                        placeholder="ワークスペース名"
                        onChange={(e) => setWorkspaceName(e.target.value)}
                    ></input>
                </div>
                <div className="input-container ic2">
                    <input
                        className="createWorkspaces-input"
                        type="text"
                        value={userName}
                        placeholder="ユーザー名"
                        onChange={(e) => setUserName(e.target.value)}
                    ></input>
                </div>
                <button 
                    className="createWorkspaces-button"
                    type="submit"
                    onClick={onClickCreateButton}
                >Create</button>
                <Link to="/workspaces"><div className="Workspaces-link" >ワークスペース一覧にもどる</div></Link>
            </form>
        </div>
    )
}

export default CreateWorkspace;