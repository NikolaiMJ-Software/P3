import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("http://localhost:8080/api/auth/username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (res.ok) {
      console.log("Login successful");
      navigate(`/${username}`);
    } else {
      const text = await res.text();
      setError(text || "Unknown error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Insert F-Klub Username:</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button type="submit">Confirm</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}



