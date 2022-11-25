import React, { useState, useEffect, useRef } from "react";
import "./EditContribution.css";
import { User } from "../../types/User";
import { useNavigate } from "react-router-dom";
import { Contribution } from "../../types/Contribution";
import { ContributionContent } from "../../ContributionSent";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const BASE_URL = "https://hackathon-backend-n7qi3ktvya-uc.a.run.app";

type editContributionProps = {
    contributions: Contribution[];
    setContributions: React.Dispatch<React.SetStateAction<Contribution[]>>;
    members: User[];
    targetContributionContent: ContributionContent;
    setTargetContributionContent: React.Dispatch<React.SetStateAction<ContributionContent>>;
}

type editContributionRes = {
    contribution_id: string;
    receiver_id: string;
    points: number;
    message: string;
    update_at: string;
}

function EditContribution(props: editContributionProps) {

    const navigate = useNavigate();
    const didEffect = useRef(false);

    const accessToken = sessionStorage.getItem("authentication");
    const workspaceId = sessionStorage.getItem("workspace_id");

    const editContribution = ( contributionId: string, points: number, message: string) => {
        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/api/contribution`,
            method: "PUT",
            headers: {
                'authentication': accessToken,
                'workspace_id': workspaceId
            },
            data: {
                contribution_id: contributionId,
                points: points,
                message: message,
            },
        };

        axios(options)
            .then((res: AxiosResponse<editContributionRes>) => {
                alert("コントリビューションを編集しました。");
                props.setTargetContributionContent({
                    contribution_id: "",
                    points: 1,
                    message: "",
                });
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

                    targetContribution.points = res.data.points;
                    targetContribution.message = res.data.message;
                    targetContribution.update_at = res.data.update_at;

                    return [...contributions, targetContribution];
                });
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                alert("コントリビューションを編集できませんでした。");
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
        }
    }, []);

    const onSubmitEditContribution = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (props.targetContributionContent.points < 1 || props.targetContributionContent.points > 100) {
            alert("ポイントは1以上100以下で指定してください。");
            e.preventDefault();
            return;
        };
        if (props.targetContributionContent.message === "") {
            alert("メッセージを記入してください。");
            e.preventDefault();
            return;
        };
        editContribution(props.targetContributionContent.contribution_id, props.targetContributionContent.points, props.targetContributionContent.message);
        e.preventDefault();
    };

    return (
        <div className="postContribution-container-m">
            <form className="EditContribution-form">
                <div className="Contribution-title">コントリビューションを編集</div>
                <div className="PostContribution-container Contribution-ic1">
                    <input
                        className="Contribution-input"
                        type="number"
                        value={props.targetContributionContent.points}
                        max="100"
                        min="1"
                        placeholder="ポイント"
                        onChange={(e) => {
                            props.setTargetContributionContent({
                                contribution_id: props.targetContributionContent.contribution_id,
                                points: e.target.valueAsNumber,
                                message: props.targetContributionContent.message,
                            });
                        }}
                    ></input>
                </div>
                <div className="PostContribution-container Contribution-ic2">
                    <textarea
                        className="Contribution-message-input"
                        value={props.targetContributionContent.message}
                        placeholder="メッセージ"
                        onChange={(e) => {
                            props.setTargetContributionContent({
                                contribution_id: props.targetContributionContent.contribution_id,
                                points: props.targetContributionContent.points,
                                message: e.target.value,
                            });
                        }}
                    ></textarea>
                </div>
                <div className="PostContribution-container Contribution-ic2">
                    <button 
                        className="EditContribution-button"
                        type="submit"
                        onClick={onSubmitEditContribution}
                    >編集</button>
                </div>
            </form>
        </div>
    )
}

export default EditContribution;