import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";

function Signup() {

    const [ Name, setName] = useState("");
    const [ Email, setEmail] = useState("");
    const [ Password, setPassword] = useState("");
    const [ PasswordForConfirmation, setPasswordForConfirmation] = useState("");

    const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (Name === "" || Email === "" || Password === "" || PasswordForConfirmation === "") return;
        e.preventDefault();
        console.log({ Name, Email, Password, PasswordForConfirmation });
    }

    return (
        <form>
            <div className="title">アカウント登録</div>
            <div className="input-container ic1">
                <input
                    type="text"
                    value={Name}
                    placeholder="名前"
                    onChange={(e) => setName(e.target.value)}
                ></input>
            </div>
            <div className="input-container ic2">
                <input
                    type="email"
                    value={Email}
                    placeholder="メールアドレス"
                    onChange={(e) => setEmail(e.target.value)}
                ></input>
            </div>
            <div className="input-container ic2">
                <input
                    type="password"
                    value={Password}
                    placeholder="パスワード(半角英数字10文字以上)"
                    onChange={(e) => setPassword(e.target.value)}
                ></input>
            </div>
            <div className="input-container ic2">
                <input
                    type="password"
                    value={PasswordForConfirmation}
                    placeholder="パスワード(確認用)"
                    onChange={(e) => setPasswordForConfirmation(e.target.value)}
                ></input>
            </div>
            <button 
                type="submit"
                onClick={onSubmit}
            >登録</button>
            <Link to="/login"><div className="login" >ログインはこちらから</div></Link>
        </form>
    )
}

export default Signup;