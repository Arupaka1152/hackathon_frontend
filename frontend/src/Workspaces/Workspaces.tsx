import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Workspaces.css";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const BASE_URL = "https://hackathon-backend-n7qi3ktvya-uc.a.run.app";

export type Workspace = {
    id: string
    name: string
    description: string
    avatar_url: string
};

function Workspaces() {

    const navigate = useNavigate();
    const [ workspaces, setWorkspaces ] = useState<Workspace[]>([]);
    const didEffect = useRef(false);

    const accessToken = sessionStorage.getItem("authentication");

    const fetchAllWorkspaces = () => {
        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/workspace`,
            method: "GET",
            headers: {
                'authentication': accessToken,
            },
        };

        axios(options)
            .then((res: AxiosResponse<Workspace[]>) => {
                if (res.data.length >= 1) {
                    for (let i = 0; i < res.data.length; i++) {
                        setWorkspaces((workspaces) => [...workspaces, { 
                            id: res.data[i].id, 
                            name: res.data[i].name, 
                            description: res.data[i].description,
                            avatar_url: res.data[i].avatar_url, 
                        }])
                    }
                }
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                //navigate("/login"); //アカウントを初めて作ったときは所属しているワークスペースはないので500エラーが出てもログインへは戻さない
                return;
            });
    };

    useEffect(() => {
        if (!didEffect.current){
            didEffect.current = true;

            if (accessToken === null) {
                console.log("accessToken not found");
                navigate("/login"); //404ページみたいなのにとばす
                return;
            };

            fetchAllWorkspaces();
        }
    }, []);

    const onClickEnterButton = (workspaceId: string, workspaceName: string, avatarUrl: string) => {
        sessionStorage.setItem('workspace_avatar_url', avatarUrl);
        sessionStorage.setItem('workspace_id', workspaceId);
        sessionStorage.setItem('workspace_name', workspaceName);
        navigate("/main");
    }

    return(
        <div>
            <div className="workspaces">
                <div className="workspaces-title">ワークスペースにログイン</div>
                <div className="WorkspaceList">
                    {workspaces.map((workspace) => {
                        let avatarUrl = "img/workspace/unknown";
                        if (workspace.avatar_url !== "") {
                            avatarUrl = workspace.avatar_url
                        }

                        return(
                            <div className="Workspace_info" key={workspace.id}>
                                <img
                                    src={`${process.env.PUBLIC_URL}/${avatarUrl}.png`}
                                    alt=""
                                    className="workspace_img"
                                />
                                <div className="Workspace_name">{workspace.name}</div>
                                <div className="Workspace_description">{workspace.description}</div>
                                <button 
                                    className="Workspaces-button"
                                    onClick={() => onClickEnterButton(workspace.id, workspace.name, avatarUrl)}
                                >Enter
                                </button>
                            </div>                            
                        );
                    })}
                </div>
                <Link to="/workspaces/create"><div className="createWorkspace-link" >ワークスペース作成はこちらから</div></Link>
            </div>
        </div>
    );
}

export default Workspaces;