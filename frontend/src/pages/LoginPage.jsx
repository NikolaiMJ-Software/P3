import logo from "../assets/logo.png";
import Topholt from "../assets/Topholt.png";
import React from "react"; //allows testing to progress
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { API } from '../services/api.jsx'
const API_URL = `${API}/auth`; //backend address

export default function LoginPage() {
  const [showTopholt, setShowTopholt] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  const onEsc = (e) => e.key === "Escape" && setShowTopholt(false);
  window.addEventListener("keydown", onEsc);
  return () => window.removeEventListener("keydown", onEsc);
  }, []);

  useEffect(() => {
  const savedUser = sessionStorage.getItem("username");
  if (savedUser) {
    navigate(`/${savedUser}`);
  }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch(`${API_URL}/username`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (res.ok) {
      console.log("Login successful");
      //Save username to sessionStorage
      sessionStorage.setItem("username", username);
      navigate(`/${username}`);
    } else {
      const text = await res.text();
      setError(text || "Unknown error");
    }
  };

  return (
  <div className="login-page login-container relative">
    {/* logo button */}
    <button
      className="login-logo"
      onClick={() => setShowTopholt(true)} 
      aria-label="Open Topholt"
    >
    <img
      src={logo}
      alt="F-Klub Logo"
    />
  </button>
    <form 
    onSubmit={handleSubmit} className="login-form">
      <h1 className="login-title">Insert F-Klub Username:</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="login-input"
      />
      <button type="submit" className="login-button">
        Confirm
      </button>

      {error && <p className="login-error">{error}</p>}
    </form>
      {showTopholt && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={() => setShowTopholt(false)}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="bg-white rounded-xl shadow-xl p-2 max-w-xl w-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <img src={Topholt} alt="Topholt" className="max-h-[90vw] w-auto mx-auto rounded-lg object-contain" />
        </div>
      </div>
    )}
    </div>
  );
}



