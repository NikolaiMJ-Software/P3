import {useNavigate, useParams} from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
export default function HomePage() {
    const navigate = useNavigate();
    const {username} = useParams();
    const [selected, setSelected] = useState("themes")
    useEffect(()=>{
        if(!username){
            navigate("/login")
        }
    }, [username, navigate])

    const goToMessages = () => {
        navigate(`/messages/${username}`);
    };
    const goToThemes = () => {
        navigate(`/themes/${username}`);
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
