import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import { useNavigate, useLocation } from "react-router-dom";
import "./WorkspaceSettings.css";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { sidebarProps } from "./components/Sidebar/Sidebar";
import { User } from "./types/User";
import { UserInfo } from "./types/User";
import { Workspace } from "./types/Workspace";

const BASE_URL = "https://hackathon-backend-n7qi3ktvya-uc.a.run.app";

function WorkspaceSettings() {

    const navigate = useNavigate();
    const didEffect = useRef(false);
    const [ users, setUsers ] = useState<User[]>([]);
    const [ workspaceDescription, setWorkspaceDescription ] = useState("");
    const [ workspaceName, setWorkspaceName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ name, setName ] = useState("");
    const [ role, setRole ] = useState("");
    const [ userId, setUserId ] = useState("");

    const fetchAllUsersInWorkspace = () => {
        const accessToken = sessionStorage.getItem("authentication");
        const workspaceId = sessionStorage.getItem("workspace_id");

        if (accessToken === null || workspaceId === null) {
            console.log("authentication failed");
            navigate("/login");
            return;
        };

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

    const fetchUserInfo = () => {
        const accessToken = sessionStorage.getItem("authentication");
        const workspaceId = sessionStorage.getItem("workspace_id");

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
                setWorkspaceName(res.data.workspace_name);
                setWorkspaceDescription(res.data.workspace_description);
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                navigate("/main");
                return;
            });
    };

    const updateWorkspaceSettings = (workspaceName: string, workspaceDescription: string) => {
        const accessToken = sessionStorage.getItem("authentication");
        const workspaceId = sessionStorage.getItem("workspace_id");

        if (accessToken === null || workspaceId === null) {
            console.log("authentication failed");
            navigate("/login");
            return;
        };

        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/api/workspace`,
            method: "PUT",
            headers: {
                'authentication': accessToken,
                'workspace_id': workspaceId
            },
            data: {
                workspace_name: workspaceName,
                description: workspaceDescription,
            },
        };

        axios(options)
            .then((res: AxiosResponse<Workspace>) => {
                setWorkspaceName(res.data.name);
                setWorkspaceDescription(res.data.description);
                alert("ワークスペース情報を変更しました。");
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                alert("ワークスペース情報を変更できませんでした。");
                return;
            });
    };

    const deleteWorkspace = () => {
        const accessToken = sessionStorage.getItem("authentication");
        const workspaceId = sessionStorage.getItem("workspace_id");

        if (accessToken === null || workspaceId === null) {
            console.log("authentication failed");
            navigate("/login");
            return;
        };

        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/api/workspace`,
            method: "DELETE",
            headers: {
                'authentication': accessToken,
                'workspace_id': workspaceId
            }
        };

        axios(options)
            .then(() => {
                alert("ワークスペースを削除しました。");
                navigate("/workspaces");
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                alert("ワークスペースを削除できませんでした。");
                return;
            });
    };

    const deleteUserFromWorkspace = (userId: string) => {
        const accessToken = sessionStorage.getItem("authentication");
        const workspaceId = sessionStorage.getItem("workspace_id");

        if (accessToken === null || workspaceId === null) {
            console.log("authentication failed");
            navigate("/login");
            return;
        };

        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/api/workspace/remove`,
            method: "POST",
            headers: {
                'authentication': accessToken,
                'workspace_id': workspaceId
            },
            data: {
                user_id: userId
            }
        };

        axios(options)
            .then(() => {
                alert("ユーザーを削除しました。");
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                alert("ユーザーを削除できませんでした。");
                return;
            });
    };

    const updateRole = (userId: string, role: string) => {
        const accessToken = sessionStorage.getItem("authentication");
        const workspaceId = sessionStorage.getItem("workspace_id");

        if (accessToken === null || workspaceId === null) {
            console.log("authentication failed");
            navigate("/login");
            return;
        };

        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/api/workspace/role`,
            method: "POST",
            headers: {
                'authentication': accessToken,
                'workspace_id': workspaceId
            },
            data: {
                user_id: userId,
                role: role
            }
        };

        axios(options)
            .then(() => {
                alert("ユーザーの権限を変更しました。");
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                alert("ユーザーの権限を変更できませんでした。");
                return;
            });
    };

    const createUser = (email: string, name: string, role: string) => {
        const accessToken = sessionStorage.getItem("authentication");
        const workspaceId = sessionStorage.getItem("workspace_id");

        if (accessToken === null || workspaceId === null) {
            console.log("authentication failed");
            navigate("/login");
            return;
        };

        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/api/workspace/invite`,
            method: "POST",
            headers: {
                'authentication': accessToken,
                'workspace_id': workspaceId
            },
            data: {
                email: email,
                name: name,
                role: role
            }
        };

        axios(options)
            .then(() => {
                alert("ユーザーを招待しました。");
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                alert("ユーザーを招待できませんでした。");
                return;
            });
    }

    const onSubmitWorkspaceSettings = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        updateWorkspaceSettings(workspaceName, workspaceDescription);
        e.preventDefault();
    };

    const onSubmitDeleteWorkspace = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        deleteWorkspace();
        e.preventDefault();
    };

    const onSubmitInviteUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        createUser(email, name, role);
        e.preventDefault();
    };

    useEffect(() => {
        if (!didEffect.current){
            didEffect.current = true;

            fetchAllUsersInWorkspace();
            fetchUserInfo();
        }
    }, []);

    return(
        <div className="main">
            <Sidebar/>
            <Header 
                title={"ワークスペース設定"}
            />
            <div className="workspace-settings-container">
                <form className="workspace-settings-form">
                    <div className="workspace-settings-title">ワークスペース情報を変更</div>
                    <div className="input-container ic1">
                        <input
                            className="workspace-settings-input"
                            type="text"
                            value={workspaceName}
                            placeholder={workspaceName}
                            onChange={(e) => setWorkspaceName(e.target.value)}
                        ></input>
                    </div>
                    <div className="input-container ic2">
                        <input
                            className="workspace-settings-input"
                            type="text"
                            value={workspaceDescription}
                            placeholder={workspaceDescription}
                            onChange={(e) => setWorkspaceDescription(e.target.value)}
                        ></input>
                    </div>
                    <button 
                        className="workspace-settings-button"
                        type="submit"
                        onClick={onSubmitWorkspaceSettings}
                    >変更</button>
                </form>
                <form className="workspace-settings-form">
                    <div className="workspace-settings-title">ワークスペースにメンバーを招待</div>
                    <div className="input-container ic1">
                        <input
                            className="workspace-settings-input"
                            type="email"
                            value={email}
                            placeholder="メールアドレス"
                            onChange={(e) => setEmail(e.target.value)}
                        ></input>
                    </div>
                    <div className="input-container ic2">
                        <input
                            className="workspace-settings-input"
                            type="text"
                            value={name}
                            placeholder="ユーザー名"
                            onChange={(e) => setName(e.target.value)}
                        ></input>
                    </div>
                    <div className="input-container ic2">
                        <input
                            className="workspace-settings-input"
                            type="text"
                            value={role}
                            placeholder="役職"
                            onChange={(e) => setRole(e.target.value)} //役職は選べるようにする
                        ></input>
                    </div>
                </form>
                <button 
                    className="workspace-invite-button"
                    type="submit"
                    onClick={onSubmitInviteUser}
                >招待</button>
                <ul className="memberList">
                    {users.map((user) => {
                        return <li className="member_info" key={user.user_id}>
                            <div className="member">{user.user_id},{user.name},{user.description},{user.role}</div>
                            <button className="workspace-settings-button">変更</button>
                            <button className="workspace-settings-button">削除</button>
                        </li>;
                    })}
                </ul>
                <div className="workspace-delete-title">ワークスペースを削除</div>
                <button 
                    className="workspace-delete-button"
                    type="submit"
                    onClick={onSubmitDeleteWorkspace}
                >削除</button>
            </div>
        </div>
    )
}

export default WorkspaceSettings;