import React, { useState, useEffect, useRef } from "react";
import "./PostContribution.css";
import { User, UserInfo } from "./../../types/User";
import { useNavigate } from "react-router-dom";
import { Contribution } from "./../../types/Contribution";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const BASE_URL = "https://hackathon-backend-n7qi3ktvya-uc.a.run.app";

type postContributionProps = {
    contributions: Contribution[];
    setContributions: React.Dispatch<React.SetStateAction<Contribution[]>>;
    members: User[];
}

function PostContribution(props: postContributionProps) {

    const navigate = useNavigate();
    const didEffect = useRef(false);
    const [ senderId, setSenderId ] = useState("");
    const [ receiverId, setReceiverId ] = useState("");
    const [ points, setPoints ] = useState(1);
    const [ message, setMessage ] = useState("");

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
                setSenderId(res.data.user_id);
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                navigate("/main");
                return;
            });
    };

    const postContribution = (receiverId: string, points: number, message: string) => {
        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/api/contribution`,
            method: "POST",
            headers: {
                'authentication': accessToken,
                'workspace_id': workspaceId
            },
            data: {
                receiver_id: receiverId,
                points: points,
                message: message,
            },
        };

        axios(options)
            .then((res: AxiosResponse<Contribution>) => {
                props.setContributions((contributions) => [...contributions, { 
                    contribution_id: res.data.contribution_id,
                    workspace_id: res.data.workspace_id,
                    sender_id: res.data.sender_id,
                    receiver_id: res.data.receiver_id,
                    points: res.data.points,
                    message: res.data.message,
                    reaction: res.data.reaction,
                    created_at: res.data.created_at,
                    update_at: res.data.update_at
                }]);
                setReceiverId("");
                setPoints(1);
                setMessage("");
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                alert("コントリビューションを投稿できませんでした。");
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

            fetchUserInfo();
        }
    }, []);

    const onSubmitPostContribution = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (receiverId === "") {
            alert("コントリビューションを送りたい人を選んでください。");
            e.preventDefault();
            return;
        }
        if (points < 1 || points > 100) {
            alert("ポイントは1以上100以下で指定してください。");
            e.preventDefault();
            return;
        };
        if (message === "") {
            alert("メッセージを記入してください。");
            e.preventDefault();
            return;
        };
        postContribution(receiverId, points, message);
        console.log(receiverId);
        e.preventDefault();
    };

    return (
        <div className="postContribution-container-m">
            <form className="PostContribution-form">
                <div className="Contribution-title">コントリビューションを投稿</div>
                <div className="PostContribution-container Contribution-ic1">
                    <select onChange={(e) => {setReceiverId(e.target.value)}} className="PostContribution-select">
                        <option key="0" value="">ユーザーを選択</option>
                        {props.members.map((member) => {
                            if (senderId !== member.user_id) {
                                return <option key={member.user_id} value={member.user_id}>{member.name}</option>
                            }
                        })}
                    </select>
                </div>
                <div className="PostContribution-container Contribution-ic2">
                    <input
                        className="Contribution-input"
                        type="number"
                        value={points}
                        max="100"
                        min="1"
                        placeholder="ポイント"
                        onChange={(e) => setPoints(e.target.valueAsNumber)}
                    ></input>
                </div>
                <div className="PostContribution-container Contribution-ic2">
                    <input
                        className="Contribution-input"
                        type="text"
                        value={message}
                        placeholder="メッセージ"
                        onChange={(e) => setMessage(e.target.value)}
                    ></input>
                </div>
                <div className="PostContribution-container Contribution-ic2">
                    <button 
                        className="PostContribution-button"
                        type="submit"
                        onClick={onSubmitPostContribution}
                    >投稿</button>
                </div>
            </form>
        </div>
    )
}

export default PostContribution;