import logo from "../assets/logo.png";
import Topholt from "../assets/Topholt.png";
import React from "react"; //allows testing to progress
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { API } from '../services/api.jsx'
const API_URL = `${API}/auth`; //backend address

export default function LoginPage() {
    const [showTopholt, setShowTopholt] = useState(false); //easter egg feature
    //login handling
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [rememberLogin, setRememberLogin] = useState(false);

    //easter egg to show picture of Topholt when logo is clicked
    useEffect(() => {
        const onEsc = (e) => e.key === "Escape" && setShowTopholt(false);
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, []);

    //navigate user to front page if session or local storage of user is saved
    useEffect(() => {
        const savedLocal = localStorage.getItem("rememberUser");
        const savedUser = sessionStorage.getItem("username");
        if (savedLocal) {
            sessionStorage.setItem("username", savedLocal); //if local storage, also save session storage
            navigate(`/${savedLocal}`);
        } else if (savedUser) {
            navigate(`/${savedUser}`);
        }
    }, [navigate]);

    //submit username handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        //sents username to backend api
        const res = await fetch(`${API_URL}/username`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
        });

        //if good response navigate to homepage
        //Save username to sessionStorage
        if (res.ok) {
            console.log("Login successful");
            sessionStorage.setItem("username", username);
            if (rememberLogin) {
                localStorage.setItem("rememberUser", username);
            }
            navigate(`/${username}`);
        } else {
            const text = await res.text();
            setError(text || "Unknown error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center -m-5 p-5 bg-topholt">
            <div className="absolute -translate-y-3 sm:-translate-y-4 top-6 left-6 size-12 sm:size-20" onClick={() => setShowTopholt(true)} aria-label="Open Topholt">
                <img
                    src={logo}
                    alt="F-Klub Logo"
                />
            </div>

            <form className="bg-primary drop-shadow-xl rounded-2xl px-5 sm:px-10 py-4 sm:py-8 w-full max-w-md flex flex-col gap-4.5" onSubmit={handleSubmit}>
                <h1 className="text-lg sm:text-2xl font-serif font-bold text-center text-text-secondary">Indtast F-Klub Brugernavn:</h1>
                <input
                    type="text"
                    placeholder="Brugernavn..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border bg-primary rounded-2xl px-4 py-2.5 text-text-secondary"
                />

                <div className="flex items-center justify-center w-full">
                    <button type="submit" className="btn-primary w-3/4">
                        Log ind
                    </button>
                </div>

                <div className="flex flex-row items-center justify-center gap-2">
                    <input 
                        type="checkbox"
                        data-testid="checkbox"
                        className="cursor-pointer"
                        onChange={(e) => {setRememberLogin(e.target.checked)}}
                    />
                    <div className="text-text-primary">Husk mit login</div>
                </div>

                {error && <p className="text-text-error text-xs sm:text-sm text-center mt-1">{error}</p>}
            </form>

            {showTopholt && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/50"
                    onClick={() => setShowTopholt(false)}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="bg-primary rounded-xl shadow-xl p-2 max-w-xl w-auto" onClick={(e) => e.stopPropagation()}>
                        <img 
                            src={Topholt} 
                            alt="Topholt" 
                            className="max-h-[90vw] w-auto mx-auto rounded-lg object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}



