import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Login() {

    const [ Email, setEmail] = useState("");
    const [ Password, setPassword] = useState("");

    const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (Email === "" || Password === "") return;
        e.preventDefault();
        console.log({ Email, Password });
    }

    return (
        <form>
            <div className="title">ログイン</div>
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
                    placeholder="パスワード"
                    onChange={(e) => setPassword(e.target.value)}
                ></input>
            </div>
            <button 
                type="submit"
                onClick={onSubmit}
            >ログイン</button>
            <Link to="/signup"><div className="signup" >アカウント登録はこちらから</div></Link>
        </form>
    )
}

export default Login;