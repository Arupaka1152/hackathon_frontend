import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const BASE_URL = "https://hackathon-backend-n7qi3ktvya-uc.a.run.app";

type SignupRes = {
    authentication: string
}

function Signup() {

    const navigate = useNavigate();
    const [ Name, setName ] = useState("");
    const [ Email, setEmail ] = useState("");
    const [ Password, setPassword ] = useState("");
    const [ PasswordForConfirmation, setPasswordForConfirmation ] = useState("");

    const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (Name === "" || Email === "" || Password === "" || PasswordForConfirmation === "") { 
            alert("未入力の項目があります。");
            return;
        }
        if (!Email.match(/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/)) {
            alert("無効なメールアドレスです。");
            return;
        }
        if (!Password.match(/^([a-zA-Z0-9]{10,})$/)) {
            alert("パスワードは半角英数字10文字以上で設定してください。");
            return;
        }
        if ( Password !== PasswordForConfirmation ) {
            alert("パスワードが一致しません。");
            return;
        }

        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/signup`,
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                name: Name,
                email: Email,
                password: Password,
            }
        };
        
        axios(options)
            .then((res: AxiosResponse<SignupRes>) => {
                sessionStorage.setItem('authentication', res.data.authentication);
                navigate("/workspaces");
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                alert("登録できませんでした。");
                return;
            });

        e.preventDefault();
    }

    return (
        <div className="signup-body">
            <form className="signup-form">
                <div className="signup-title">アカウント登録</div>
                <div className="input-container ic1">
                    <input
                        className="signup-input"
                        type="text"
                        value={Name}
                        placeholder="名前"
                        onChange={(e) => setName(e.target.value)}
                    ></input>
                </div>
                <div className="input-container ic2">
                    <input
                        className="signup-input"
                        type="email"
                        value={Email}
                        placeholder="メールアドレス"
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>
                </div>
                <div className="input-container ic2">
                    <input
                        className="signup-input"
                        type="password"
                        value={Password}
                        placeholder="パスワード(半角英数字10文字以上)"
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>
                </div>
                <div className="input-container ic2">
                    <input
                        className="signup-input"
                        type="password"
                        value={PasswordForConfirmation}
                        placeholder="パスワード(確認用)"
                        onChange={(e) => setPasswordForConfirmation(e.target.value)}
                    ></input>
                </div>
                <button 
                    className="signup-button"
                    type="submit"
                    onClick={onSubmit}
                >登録</button>
                <Link to="/login"><div className="login-link" >ログインはこちらから</div></Link>
            </form>
        </div>
    )
}

export default Signup;