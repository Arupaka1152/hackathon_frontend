import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import { useNavigate } from "react-router-dom";
import "./Members.css";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { User } from "./types/User";
import UserSettings from "./UserSettings";

const BASE_URL = "https://hackathon-backend-n7qi3ktvya-uc.a.run.app";

function Members() {

    const navigate = useNavigate();
    const didEffect = useRef(false);
    const [ users, setUsers ] = useState<User[]>([]);

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

    useEffect(() => {
        if (!didEffect.current){
            didEffect.current = true;

            if (accessToken === null || workspaceId === null) {
                console.log("authentication failed");
                navigate("/login");
                return;
            };

            fetchAllUsersInWorkspace();
        }
    }, []);

    return(
        <div className="main">
            <Sidebar />
            <Header 
                title={"メンバー一覧"}
            />
            <div className="members-container">
                <table className="members-table">
                    <thead className="members-thead">
                        <tr className="members-tr">
                            <th className="t-icon"></th>
                            <th className="t-user">ユーザー名</th>
                            <th className="t-description">自己紹介</th>
                            <th className="t-role">役職</th>
                        </tr>
                    </thead>
                    <tbody className="members-tbody">
                        {users.map((user) => {
                            return(
                                <tr className="members-tr">
                                    <td>
                                        <img 
                                            src={`${process.env.PUBLIC_URL}/${user.avatar_url}.png`}
                                            alt="" 
                                            className="member_img"
                                        />
                                    </td>
                                    <td>{user.name}</td>
                                    <td>{user.description}</td>
                                    <td>{user.role}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Members;