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

type sendReactionRes = {
    contribution_id: string;
    reaction: number;
    update_at: string;
}

const BASE_URL = "https://hackathon-backend-n7qi3ktvya-uc.a.run.app";

function TimelineForSent(props: timelineForSentProps) {
    
    const navigate = useNavigate();
    const didEffect = useRef(false);

    const accessToken = sessionStorage.getItem("authentication");
    const workspaceId = sessionStorage.getItem("workspace_id");

    const deleteContribution = (contributionId: string) => {
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
                props.setContributions(() => {
                    return props.contributions.filter(
                        (contribution) => {
                            return(
                                contribution.contribution_id !== contributionId
                            );
                        }
                    );
                });
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
    };

    const convertIdToName = (userId: string) => {
        let name: string = "";
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

    const onClickDeleteButton = (contributionId: string) => {
        const result = window.confirm("確認：コントリビューションを削除しますか？");
        if (result) {
            deleteContribution(contributionId);
        } else {
            alert("コントリビューションの削除をキャンセルしました。");
        }
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
                                className="timeline-edit-button"
                                onClick={() => {props.setTargetContributionContent({
                                    contribution_id: contribution.contribution_id,
                                    points: contribution.points,
                                    message: contribution.message,
                                })}}
                            >編集</button>
                            <button 
                                className="timeline-delete-button"
                                onClick={() => onClickDeleteButton(contribution.contribution_id)}
                            >削除</button>
                            <button 
                                className="reaction-button-sent"
                                onClick={() => onClickSendReactionButton(contribution.contribution_id)}
                            >いいね！{contribution.reaction}</button>
                        </div>                        
                    </li>
                    );
                })}
            </ul>
        </div>
    )
}

export default TimelineForSent;