import { useState } from "react";

export default function ThemeVoting() {

    const [message, setMessage] = useState("");

    // Gets the theme data
    if(1) {
        async () => {
            const response = await fetch("http://localhost:8080/api/vote/getThemes");
            const themes = await response.json();
            setMessage(themes);
        }
    }

    // HTML of the page
    return (
        <form>
            {message && <p>{message}</p>}
        </form>
    );
}