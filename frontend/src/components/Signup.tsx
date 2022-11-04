import React, { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import "./Signup.css";

function Signup() {

    /* const [ Name, setName] = useState("");
    const [ Email, setEmail] = useState("");
    const [ Password, setPassword] = useState("");
    const [ PasswordForConfirmation, setPasswordForConfirmation] = useState(""); */

    return (
        <form className="form">
            <div className="title">アカウント登録</div>
            <div className="input-container ic1">
                <input className="input" type="text" />
                <label className="placeholder">名前</label>
            </div>
            <div className="input-container ic2">
                <input className="input" type="text" />
                <label className="placeholder">メールアドレス</label>
            </div>
            <div className="input-container ic2">
                <input className="input" type="text" />
                <label className="placeholder">パスワード</label>
            </div>
            <div className="input-container ic2">
                <input className="input" type="text" />
                <label className="placeholder">パスワード（確認用）</label>
            </div>
            <button type="submit" className="submit">登録</button>
        </form>
    )
}

export default Signup;