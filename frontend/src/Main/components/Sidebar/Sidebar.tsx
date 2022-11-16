import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { UserInfo } from "./../../types/User";

const BASE_URL = "https://hackathon-backend-n7qi3ktvya-uc.a.run.app";

export type sidebarProps = {
    role: string;
    workspaceName: string;
}

function Sidebar() {

    const navigate = useNavigate();
    const [ role, setRole ] = useState("");
    const [ workspaceName, setWorkspaceName ] = useState("");
    const didEffect = useRef(false);

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
                setRole(res.data.role);
                setWorkspaceName(res.data.workspace_name);
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

    return( 
    <div className="Sidebar">
        <div className="SidebarTop">
            <p className="WorkspaceName">{workspaceName}</p>
        </div>
        <ul className="SidebarList">
                <li 
                    className="row"
                    onClick={() => {navigate("/main");}}
                >
                    <div id="title">ホーム</div>
                </li>

                <li 
                    className="row"
                    onClick={() => {navigate("/main/report");}}
                >
                    <div id="title">週間レポート</div>
                </li>

                <li 
                    className="row"
                    onClick={() => {navigate("/main/members");}}
                >
                    <div id="title">メンバー一覧</div>
                </li>

                <li 
                    className="row"
                    onClick={() => {navigate("/main/user-settings");}}
                >
                    <div id="title">ユーザー設定</div>
                </li>

                <li 
                    className="row"
                    onClick={() => {navigate("/main/workspace-settings", {state: {role: role, workspaceName: workspaceName}});}}
                >
                    <div id="title">ワークスペース設定</div>
                </li>

                <li 
                    className="row"
                    onClick={() => {navigate("/workspaces");}}
                >
                    <div id="title">他のワークスペースへ移動</div>
                </li>

                <li 
                    className="row"
                    onClick={() => {
                        sessionStorage.removeItem('authentication');
                        sessionStorage.removeItem('workspace_id');
                        navigate("/login");
                    }}
                >
                    <div id="title">ログアウト</div>
                </li>
        </ul>
    </div>
    );
}

export default Sidebar; 