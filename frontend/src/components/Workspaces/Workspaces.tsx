import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Workspaces.css";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const BASE_URL = "https://hackathon-backend-n7qi3ktvya-uc.a.run.app";

type Workspace = {
    id: string
    name: string
    avatar_url: string
}

function Workspaces() {

    const navigate = useNavigate();
    const [ workspaces, setWorkspaces ] = useState<Workspace[]>([]);
    const didEffect = useRef(false);

    useEffect(() => {
        if (!didEffect.current){
            didEffect.current = true;

            const accessToken = sessionStorage.getItem("authentication")
            if (accessToken === null) {
                console.log("accessToken not found");
                navigate("/login"); //404ページみたいなのにとばす
                return;
            };

            const options: AxiosRequestConfig = {
                url: `${BASE_URL}/workspace`,
                method: "GET",
                headers: {
                    'authentication': accessToken,
                },
            };

            axios(options)
                .then((res: AxiosResponse<Workspace[]>) => {
                    if (res.data.length >= 1) { //アカウントを初めて作ったときは所属しているワークスペースはない
                        for (let i = 0; i < res.data.length; i++) {
                            setWorkspaces((workspaces) => [...workspaces, { 
                                id: res.data[i].id, 
                                name: res.data[i].name, 
                                avatar_url: res.data[i].avatar_url 
                            }])
                        }
                    }
                })
                .catch((e: AxiosError<{ error: string }>) => {
                    console.log(e.message);
                    navigate("/login"); //404ページみたいなのにとばす
                    return;
                });
        }
    }, []);

    const onClickEnterButton = (workspaceId: string) => {
        sessionStorage.setItem('workspace_id', workspaceId);
        navigate("/main");
    }

    return(
        <div>
            <ul>
                {workspaces.map((workspace) => {
                    return <li key={workspace.id}>
                        <span>{workspace.name}, {workspace.avatar_url}</span>
                        <button onClick={() => onClickEnterButton(workspace.id)}>Enter</button>
                    </li>;
                })}
            </ul>
        </div>
    );
}

export default Workspaces;