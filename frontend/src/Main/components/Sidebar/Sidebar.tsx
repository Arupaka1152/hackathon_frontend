import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

export type sidebarProps = {
    role: string;
    workspaceName: string;
}

function Sidebar(props: sidebarProps) {

    const navigate = useNavigate();

    return( 
    <div className="Sidebar">
        <div className="SidebarTop">
            <p className="WorkspaceName">{props.workspaceName}</p>
        </div>
        <ul className="SidebarList">
                <li 
                    className="row"
                    onClick={() => {navigate("/main", {state: {role: props.role, workspaceName: props.workspaceName}});}}
                >
                    <div id="title">ホーム</div>
                </li>

                <li 
                    className="row"
                    onClick={() => {navigate("/main/report", {state: {role: props.role, workspaceName: props.workspaceName}});}}
                >
                    <div id="title">週間レポート</div>
                </li>

                <li 
                    className="row"
                    onClick={() => {navigate("/main/members", {state: {role: props.role, workspaceName: props.workspaceName}});}}
                >
                    <div id="title">メンバー一覧</div>
                </li>

                <li 
                    className="row"
                    onClick={() => {navigate("/main/user-settings", {state: {role: props.role, workspaceName: props.workspaceName}});}}
                >
                    <div id="title">ユーザー設定</div>
                </li>

                <li 
                    className="row"
                    onClick={() => {navigate("/main/workspace-settings", {state: {role: props.role, workspaceName: props.workspaceName}});}}
                >
                    <div id="title">ワークスペース設定</div>
                </li>

                <li 
                    className="row"
                    onClick={() => {navigate("/workspaces");}}
                >
                    <div id="title">他のワークスペースへ移動</div>
                </li>

                <li 
                    className="row"
                    onClick={() => {
                        sessionStorage.removeItem('authentication');
                        sessionStorage.removeItem('workspace_id');
                        navigate("/login");
                    }}
                >
                    <div id="title">ログアウト</div>
                </li>
        </ul>
    </div>
    );
}

export default Sidebar; 