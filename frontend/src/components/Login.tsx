import React, { useState } from "react";
import { Form, Card } from "react-bootstrap";

function Login() {

    const [ Name, setName] = useState("");
    const [ Email, setEmail] = useState("");
    const [ Password, setPassword] = useState("");
    const [ PasswordForConfirmation, setPasswordForConfirmation] = useState("");

    
    return (
        <div>
            <Card>
                <Card.Body>
                    <Form>
                    <Form.Group id="email">
                        <Form.Label>メールアドレス</Form.Label>
                        <Form.Control 
                            type={"email"}
                            value={Email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required />
                    </Form.Group>
                    <Form.Group id="password">
                        <Form.Label>パスワード</Form.Label>
                        <Form.Control 
                            type={"password"}
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)}
                            required />
                    </Form.Group>
                    </Form>
                </Card.Body>
            </Card>



            <Form>
                    <Form.Group id="name" className="signup--input-box">
                        <Form.Label>名前</Form.Label>
                        <Form.Control 
                            type={"name"}
                            value={Name}
                            onChange={(e) => setName(e.target.value)} 
                            required />
                    </Form.Group>
                    <Form.Group id="email" className="signup--input-box">
                        <Form.Label>メールアドレス</Form.Label>
                        <Form.Control 
                            type={"email"}
                            value={Email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required />
                    </Form.Group>
                    <Form.Group id="password" className="signup--input-box">
                        <Form.Label>パスワード</Form.Label>
                        <Form.Control 
                            type={"password"}
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)}
                            required />
                    </Form.Group>
                    <Form.Group id="password-confirm" className="signup--input-box">
                        <Form.Label>パスワード（確認用）</Form.Label>
                        <Form.Control
                            type={"password"}
                            value={PasswordForConfirmation}
                            onChange={(e) => setPasswordForConfirmation(e.target.value)}
                            required />
                      </Form.Group>
                    </Form>
        </div>
    )
}

export default Login;