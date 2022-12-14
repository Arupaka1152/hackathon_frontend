import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import { useNavigate } from "react-router-dom";
import "./WorkspaceSettings.css";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { User } from "./types/User";
import { UserInfo } from "./types/User";
import { Workspace } from "./types/Workspace";

const BASE_URL = "https://hackathon-backend-n7qi3ktvya-uc.a.run.app";

type changeRoleRes = {
    user_id: string;
    role: string;
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function WorkspaceSettings() {

    const navigate = useNavigate();
    const didEffect = useRef(false);
    const [ users, setUsers ] = useState<User[]>([]);
    const [ workspaceDescription, setWorkspaceDescription ] = useState("");
    const [ workspaceName, setWorkspaceName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ name, setName ] = useState("");
    const [ role, setRole ] = useState("");
    const [ targetUserRole, setTargetUserRole ] = useState("");

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
                alert("???????????????????????????????????????????????????");
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                alert("???????????????????????????????????????????????????????????????");
                return;
            });
    };

    const deleteWorkspace = () => {
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
                alert("?????????????????????????????????????????????");
                navigate("/workspaces");
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                alert("?????????????????????????????????????????????????????????");
                return;
            });
    };

    const deleteUserFromWorkspace = (userId: string) => {
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
                alert("????????????????????????????????????");
                setUsers(() => {
                    return users.filter(
                        (user) => {
                            return(
                                user.user_id !== userId
                            );
                        }
                    );
                });
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                alert("????????????????????????????????????????????????");
                return;
            });
    };

    const changeRole = (userId: string, role: string) => {
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
            .then((res: AxiosResponse<changeRoleRes>) => {
                alert("?????????????????????????????????????????????");
                setUsers(() => {
                    const targetUser = users.find(
                        (user) => {
                            return(
                                user.user_id === userId
                            );
                        }
                    );

                    if (targetUser === undefined) {
                        return users;
                    }

                    const newUsers = users.filter(
                        (user) => {
                            return(
                                user.user_id !== userId
                            );
                        }
                    );

                    targetUser.role = res.data.role;

                    return [...newUsers, targetUser];
                });
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                alert("?????????????????????????????????????????????????????????");
                return;
            });
    };

    const createUser = (email: string, name: string, role: string) => {

        const randNumForUser: string = getRandomInt(1,15).toString();
        const userAvatarUrl = `img/user/${randNumForUser}`;

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
                role: role,
                avatar_url: userAvatarUrl,
            },
        };

        axios(options)
            .then(() => {
                alert("????????????????????????????????????");
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                alert("????????????????????????????????????????????????");
                return;
            });
    }

    const onSubmitWorkspaceSettings = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        updateWorkspaceSettings(workspaceName, workspaceDescription);
        e.preventDefault();
    };

    const onSubmitDeleteWorkspace = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const result = window.confirm("??????????????????????????????????????????????????????");
        if (result) {
            deleteWorkspace();
        } else {
            alert("???????????????????????????????????????????????????????????????")
          }
        e.preventDefault();
    };

    const onSubmitInviteUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        createUser(email, name, role);
        e.preventDefault();
    };

    const onSubmitDeleteUserFromWorkspace = (userId: string) => {
        const result = window.confirm("?????????????????????????????????????????????????????????????????????");
        if (result) {
            deleteUserFromWorkspace(userId);
        } else {
            alert("??????????????????????????????????????????????????????")
          }
    };

    const onSubmitChangeRole = (userId: string) => {
        changeRole(userId, targetUserRole);
        setTargetUserRole("");
    };

    useEffect(() => {
        if (!didEffect.current){
            didEffect.current = true;

            if (accessToken === null || workspaceId === null) {
                console.log("authentication failed");
                navigate("/login");
                return;
            };

            fetchAllUsersInWorkspace();
            fetchUserInfo();
        }
    }, []);

    return(
        <div className="main">
            <Sidebar/>
            <Header 
                title={"???????????????????????????"}
            />
            <div className="workspace-settings-container">
                <div className="workspace-settings-left" >
                    <div className="edit-container">
                        <form className="workspace-settings-form">
                            <div className="workspace-settings-title"><h3>????????????????????????????????????</h3></div>
                            <div className="workspace-input-container workspace-settings-ic1">
                                <p>????????????????????????</p>
                                <input
                                    className="workspace-settings-input"
                                    type="text"
                                    value={workspaceName}
                                    placeholder={workspaceName}
                                    onChange={(e) => setWorkspaceName(e.target.value)}
                                ></input>
                            </div>
                            <div className="workspace-input-container workspace-settings-ic2">
                                <p>??????????????????????????????</p>
                                <textarea
                                    className="workspace-settings-textarea"
                                    value={workspaceDescription}
                                    placeholder={workspaceDescription}
                                    onChange={(e) => setWorkspaceDescription(e.target.value)}
                                ></textarea>
                            </div>
                            <button 
                                className="workspace-edit-button"
                                type="submit"
                                onClick={onSubmitWorkspaceSettings}
                            >??????</button>
                        </form>
                    </div>
                    <div className="invite-container">
                        <form className="workspace-settings-form">
                            <div className="workspace-settings-title"><h3>?????????????????????????????????????????????</h3></div>
                            <div className="workspace-input-container workspace-settings-ic1">
                                <input
                                    className="workspace-settings-input"
                                    type="email"
                                    value={email}
                                    placeholder="?????????????????????"
                                    onChange={(e) => setEmail(e.target.value)}
                                ></input>
                            </div>
                            <div className="workspace-input-container workspace-settings-ic2">
                                <input
                                className="workspace-settings-input"
                                type="text"
                                value={name}
                                placeholder="???????????????"
                                onChange={(e) => setName(e.target.value)}
                            ></input>
                            </div>
                            <div className="workspace-input-container workspace-settings-ic2">
                                <select 
                                    className="select-role"
                                    onChange={(e) => {setRole(e.target.value)}}
                                >
                                    <option key="0" value="">???????????????</option>
                                    <option key="general" value="general">general</option>
                                    <option key="manager" value="manager">manager</option>
                                </select> 
                            </div>
                        </form>
                        <button 
                            className="workspace-invite-button"
                            type="submit"
                            onClick={onSubmitInviteUser}
                        >??????</button>
                    </div>
                    <div className="delete-container">
                        <div className="workspace-delete-title"><h3>??????????????????????????????</h3></div>
                        <button 
                            className="workspace-delete-button"
                            type="submit"
                            onClick={onSubmitDeleteWorkspace}
                        >??????</button>
                    </div>
                </div>
                <div className="workspace-settings-right" >
                    <div className="table-container">
                        <div className="workspace-settings-title"><h3>???????????????????????????????????????????????????</h3></div>
                        <table className="workspace-settings-table">
                            <caption></caption>
                            <thead className="workspace-settings-thead">
                                <tr className="workspace-settings-tr">
                                    <th></th>
                                    <th>???????????????</th>
                                    <th>??????</th>
                                    <th>???????????????</th>
                                    <th>?????????????????????</th>
                                </tr>
                            </thead>
                            <tbody className="workspace-settings-tbody">
                                {users.map((user) => {
                                    return(
                                        <tr className="workspace-settings-tr">
                                            <td>
                                                <img 
                                                    src={`${process.env.PUBLIC_URL}/${user.avatar_url}.png`}
                                                    alt="" 
                                                    className="setting_img"
                                                />
                                            </td>
                                            <td>{user.name}</td>
                                            <td>{user.role}</td>
                                            <td>
                                                <div>
                                                    <select onChange={(e) => {setTargetUserRole(e.target.value)}}>
                                                        <option key="0" value="">???????????????</option>
                                                        <option key="general" value="general">general</option>
                                                        <option key="manager" value="manager">manager</option>
                                                    </select>    
                                                    <button 
                                                        className="role-edit-button"
                                                        onClick={() => {onSubmitChangeRole(user.user_id)}}
                                                    >??????</button>
                                                </div>
                                            </td>
                                            <td>
                                                <button 
                                                    className="user-delete-button"
                                                    onClick={() => {onSubmitDeleteUserFromWorkspace(user.user_id)}}
                                                >??????</button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>    
            </div>
        </div>
    )
}

export default WorkspaceSettings;