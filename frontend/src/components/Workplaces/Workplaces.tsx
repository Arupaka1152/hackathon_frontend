import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Workplaces.css";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const BASE_URL = "https://hackathon-backend-n7qi3ktvya-uc.a.run.app";

type Workplace = {
    id: string
    name: string
    avatar_url: string
}

function Workplaces() {

    const navigate = useNavigate();
    const [ workplaces, setWorkplaces ] = useState<Workplace[]>([]);

    useEffect(() => {
        const accessToken = localStorage.getItem("authentication")
        if (accessToken === null) {
            console.log("accessToken not found");
            navigate("/login"); //404ページみたいなのにとばす
            return;
        };

        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/workplace`,
            method: "GET",
            headers: {
                'authentication': accessToken,
            },
        };

        axios(options)
            .then((res: AxiosResponse<Workplace[]>) => {
                if (res.data.length >= 1) { //アカウントを初めて作ったときは所属しているワークスペースはない
                    for (let i = 0; i < res.data.length; i++) {
                        setWorkplaces((workplaces) => [...workplaces, { 
                            id: res.data[i].id, 
                            name: res.data[i].name, 
                            avatar_url: res.data[i].avatar_url 
                        }])
                    }
                }
            })
            .catch((e: AxiosError<{ error: string }>) => {
                console.log(e.message);
                navigate("/login"); //404ページみたいなのにとばす
                return;
            });
    })

    return(
        <div>
            
        </div>
    );
}