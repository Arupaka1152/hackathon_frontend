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

function Timeline(props: timelineProps) {

    const convertIdToName = (userId: string) => {
        let name: string = "";
        props.members.map((member) => {
            if (userId === member.user_id) {
                name = member.name
            }
        });
        
        return name;
    };

    return (
        <div className="Timeline-container">
            <ul className="contribution_ul">
                {props.contributions.map((contribution) => {
                    return <li className="contribution_li" key={contribution.contribution_id}>
                        <div className="contribution">
                            {convertIdToName(contribution.sender_id)},
                            {convertIdToName(contribution.receiver_id)},
                            {contribution.message},
                            {contribution.points},
                            {contribution.reaction},
                            {contribution.created_at},
                            {contribution.update_at}
                        </div>
                    </li>;
                })}
            </ul>
        </div>
    )
}

export default Timeline;