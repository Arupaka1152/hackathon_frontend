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

const BASE_URL = "https://hackathon-backend-n7qi3ktvya-uc.a.run.app";

function Timeline(props: timelineProps) {

    const [ contributionId, setContributionId ] = useState("");

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
                            onClick={() => onClickSendButton(contribution.contribution_id)}
                        >Good!!</button>
                    </li>
                    );
                })}
            </ul>
        </div>
    )
}

export default Timeline;