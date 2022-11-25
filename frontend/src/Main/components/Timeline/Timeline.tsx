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

    const convertIdToUrl = (userId: string) => {
        let url: string = "img/user/unknown";
        props.members.map((member) => {
            if (userId === member.user_id) {
                url = member.avatar_url
            }
        });
        return url;
    };

    const onClickSendButton = (contributionId: string) => {
        sendReaction(contributionId);
    };

    return (
        <div className="Timeline-container">
            <ul className="contribution_ul">
                {props.contributions.map((contribution) => {
                    const senderUrl = convertIdToUrl(contribution.sender_id);
                    const senderAvatarUrl = `${process.env.PUBLIC_URL}/${senderUrl}.png`;
                    const receiverUrl = convertIdToUrl(contribution.receiver_id);
                    const receiverAvatarUrl = `${process.env.PUBLIC_URL}/${receiverUrl}.png`;

                    return (
                    <li className="contribution_li" key={contribution.contribution_id}>
                        <div className="img_container">
                            <img 
                                src={senderAvatarUrl} 
                                alt=""
                                className="avatar_img"
                            />
                            <div className="info-container">
                                <p>{convertIdToName(contribution.sender_id)}</p>
                            </div>
                            <img 
                                src={`${process.env.PUBLIC_URL}/img/To.png`}
                                alt="" 
                                className="to_img"
                            />
                            <img 
                                src={receiverAvatarUrl}
                                alt="" 
                                className="avatar_img"
                            />
                            <div className="info-container">
                                <p>{convertIdToName(contribution.receiver_id)}</p>
                            </div>
                            <div className="point">
                                + {contribution.points} pt
                            </div>
                        </div>
                        <div className="content-container">
                            <div className="contribution">
                                <p className="message">{contribution.message}</p>
                            </div>
                            <div className="contribution-createdAt">
                                <p className="created_at">{contribution.created_at}</p>
                            </div>
                            <button 
                                className="reaction-button"
                                onClick={() => onClickSendButton(contribution.contribution_id)}
                            >いいね！{contribution.reaction}</button>
                        </div> 
                    </li>
                    );
                })}
            </ul>
        </div>
    )
}

export default Timeline;