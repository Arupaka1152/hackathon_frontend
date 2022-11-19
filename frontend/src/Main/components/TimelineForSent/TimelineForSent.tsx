import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { Contribution } from "../../types/Contribution";
import { User } from "../../types/User";
import { ContributionContent } from "../../ContributionSent";
import "./TimelineForSent.css";

type timelineForSentProps = {
    contributions: Contribution[];
    setContributions: React.Dispatch<React.SetStateAction<Contribution[]>>;
    members: User[];
    targetContributionContent: ContributionContent;
    setTargetContributionContent: React.Dispatch<React.SetStateAction<ContributionContent>>;
}

const BASE_URL = "https://hackathon-backend-n7qi3ktvya-uc.a.run.app";

function TimelineForSent(props: timelineForSentProps) {
    
    const navigate = useNavigate();
    const didEffect = useRef(false);

    const accessToken = sessionStorage.getItem("authentication");
    const workspaceId = sessionStorage.getItem("workspace_id");

    const deleteReaction = (contributionId: string) => {
        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/api/contribution`,
            method: "DELETE",
            headers: {
                'authentication': accessToken,
                'workspace_id': workspaceId
            },
            data: {
                contribution_id: contributionId
            }
        };

        axios(options)
            .then(() => {
                alert("コントリビューションを削除しました。");
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                alert("コントリビューションを削除できませんでした。");
                return;
            });
    };

    const sendReaction = (contributionId: string) => {
        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/api/contribution/reaction`,
            method: "POST",
            headers: {
                'authentication': accessToken,
                'workspace_id': workspaceId
            },
            data: {
                contribution_id: contributionId
            }
        };

        axios(options)
            .then(() => {
                alert("リアクションを送信しました。");
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                alert("リアクションを送信できませんでした。");
                return;
            });
    }

    const convertIdToName = (userId: string) => {
        let name: string = "";
        props.members.map((member) => {
            if (userId === member.user_id) {
                name = member.name
            }
        });
        return name;
    };

    const onClickDeleteButton = (contributionId: string) => {
        deleteReaction(contributionId);
    };

    const onClickSendReactionButton = (contributionId: string) => {
        sendReaction(contributionId);
    };

    useEffect(() => {
        if (!didEffect.current){
            didEffect.current = true;

            if (accessToken === null || workspaceId === null) {
                console.log("authentication failed");
                navigate("/login");
                return;
            };
        }
    }, []);

    return (
        <div className="TimelineForSent-container">
            <ul className="contribution_ul">
                {props.contributions.map((contribution) => {
                    return (
                    <li className="contribution_li" key={contribution.contribution_id}>
                        <div className="contribution">
                            {convertIdToName(contribution.sender_id)},
                            {convertIdToName(contribution.receiver_id)},
                            {contribution.message},
                            {contribution.points},
                            {contribution.reaction},
                            {contribution.created_at},
                            {contribution.update_at}
                        </div>
                        <button 
                            className="reaction-button"
                            onClick={() => onClickSendReactionButton(contribution.contribution_id)}
                        >Good!!</button>
                        <button 
                            className="reaction-button"
                            onClick={() => {props.setTargetContributionContent({
                                contribution_id: contribution.contribution_id,
                                points: contribution.points,
                                message: contribution.message,
                            })}}
                        >編集</button>
                        <button 
                            className="reaction-button"
                            onClick={() => onClickDeleteButton(contribution.contribution_id)}
                        >削除</button>
                    </li>
                    );
                })}
            </ul>
        </div>
    )
}

export default TimelineForSent;