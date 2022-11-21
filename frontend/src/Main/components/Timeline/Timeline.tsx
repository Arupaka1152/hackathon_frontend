import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { Contribution } from "./../../types/Contribution";
import { User } from "./../../types/User";
import "./Timeline.css";

type timelineProps = {
    contributions: Contribution[];
    setContributions: React.Dispatch<React.SetStateAction<Contribution[]>>;
    members: User[];
}

type sendReactionRes = {
    contribution_id: string;
    reaction: number;
    update_at: string;
}

const BASE_URL = "https://hackathon-backend-n7qi3ktvya-uc.a.run.app";

function Timeline(props: timelineProps) {

    const accessToken = sessionStorage.getItem("authentication");
    const workspaceId = sessionStorage.getItem("workspace_id");

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
            .then((res: AxiosResponse<sendReactionRes>) => {
                props.setContributions(() => {
                    const targetContribution = props.contributions.find(
                        (contribution) => {
                            return(
                                contribution.contribution_id === contributionId
                            );
                        }
                    );

                    if (targetContribution === undefined) {
                        return props.contributions;
                    }

                    const contributions = props.contributions.filter(
                        (contribution) => {
                            return(
                                contribution.contribution_id !== contributionId
                            );
                        }
                    );

                    targetContribution.reaction = res.data.reaction;
                    targetContribution.update_at = res.data.update_at;

                    return [...contributions, targetContribution];
                });
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                alert("リアクションを送信できませんでした。");
                return;
            });
    }

    const convertIdToName = (userId: string) => {
        let name: string = "DeletedUser";
        props.members.map((member) => {
            if (userId === member.user_id) {
                name = member.name
            }
        });
        return name;
    };

    const onClickSendButton = (contributionId: string) => {
        sendReaction(contributionId);
    };

    return (
        <div className="Timeline-container">
            <ul className="contribution_ul">
                {props.contributions.map((contribution) => {
                    return (
                    <li className="contribution_li" key={contribution.contribution_id}>
                        <div className="contribution">
                            {convertIdToName(contribution.sender_id)} さんから
                            {convertIdToName(contribution.receiver_id)} さんへ
                        </div>
                        <div className="contribution">
                            メッセージ:{contribution.message}
                        </div>
                        <div className="contribution">
                            {contribution.points}ポイント
                        </div>
                        <div className="contribution">
                            投稿:{contribution.created_at}
                            更新:{contribution.update_at}
                        </div>
                        <button 
                            className="reaction-button"
                            onClick={() => onClickSendButton(contribution.contribution_id)}
                        >いいね！{contribution.reaction}</button>
                    </li>
                    );
                })}
            </ul>
        </div>
    )
}

export default Timeline;