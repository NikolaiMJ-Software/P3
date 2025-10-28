import {useNavigate, useParams} from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import ThemeBrowser from "../components/ThemeBrowser.jsx";
import SoundSampleBrowser from "../components/SoundSampleBrowser.jsx";


export default function HomePage() {
    const navigate = useNavigate();
    const {username: routeUsername} = useParams();
    const [selected, setSelected] = useState("themes")

    const user = routeUsername || sessionStorage.getItem("username")

    useEffect(() => {
        if (!user) {
        navigate("/login");
        return;
        }
        if (!routeUsername && user) {
        navigate(`/${user}`, { replace: true });
        }
    }, [user, routeUsername, navigate]);

     if (!user) return null;

    const goToMessages = () => {
        navigate(`/messages/${user}`);
    };
    const goToThemes = () => {
        navigate(`/themes/${user}`);
    }

    return <>
        {/* Top toggle buttons */}
        <div className={"flex gap-4"}>
            <button className={`px-6 py-3 rounded-2xl transition-colors
            ${selected === "themes" ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-300"}`}
                    onClick={() => setSelected("themes")}>Themes</button>
            <button className={`px-6 py-3 rounded-2xl transition-colors
            ${selected === "samples" ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-300"}`}
                    onClick={() => setSelected("samples")}>Lydprøveforslag</button>
        </div>
        <div>
            {selected === "themes" ? <ThemeBrowser /> : <SoundSampleBrowser />}
        </div>
        <h1>Welcome to the Home Page</h1>
        <button onClick={goToMessages}>Messages</button>
        <button onClick={goToThemes}>Themes</button>
    </>
}
