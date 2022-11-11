import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const BASE_URL = "https://hackathon-backend-n7qi3ktvya-uc.a.run.app";

type LoginRes = {
    authentication: string
}

function Login() {

    const navigate = useNavigate();
    const [ Email, setEmail ] = useState("");
    const [ Password, setPassword ] = useState("");

    const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (Email === "" || Password === "") {
            alert("未入力の項目があります。");
            return;
        }
        if (!Email.match(/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/)) {
            alert("無効なメールアドレスです。");
            return;
        }
        if (!Password.match(/^([a-zA-Z0-9]{10,})$/)) {
            alert("パスワードは半角英数字10文字以上です。");
            return;
        }

        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/login`,
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                email: Email,
                password: Password,
            }
        };

        axios(options)
            .then((res: AxiosResponse<LoginRes>) => {
                sessionStorage.setItem('authentication', res.data.authentication);
                navigate("/workspaces");
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                alert("通信エラー");
                return;
            });

        e.preventDefault();
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