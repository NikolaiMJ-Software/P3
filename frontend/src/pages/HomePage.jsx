import {useNavigate, useParams} from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import ThemeBrowser from "../components/Theme/ThemeBrowser.jsx";
import SoundSampleBrowser from "../components/SoundSampleBrowser.jsx";
import SubmitSSTestPage from "../components/SubmitSSTestPage.jsx";


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
        <div className={"flex gap-4 ml-10"}>
            <button className={`border px-6 py-3 rounded-2xl transition-colors
            ${selected === "themes" ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-300"}`}
                    onClick={() => setSelected("themes")}>Themes</button>
            <button className={`border px-6 py-3 rounded-2xl transition-colors
            ${selected === "samples" ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-300"}`}
                    onClick={() => setSelected("samples")}>Lydprøveforslag</button>
        </div>

        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-9 min-w-0 overflow-hidden"> {
                selected === "themes" ? (
                    <ThemeBrowser />
                ) : selected === "samples" ? (
                    <SoundSampleBrowser />
                ) : selected === "submitSample" ? (
                    <SubmitSSTestPage />
                ) : null
            }
            </div>
            <aside className="col-span-12 lg:col-span-3 lg:ml-2 pt-10">
                <div className="sticky top-10 flex flex-col gap-4 z-10">
                    <button className="w-full block rounded-2xl px-6 py-3 bg-white hover:bg-gray-300 border"
                        onClick={() => {navigate(`/faq/${user}`)}}>
                        Info
                    </button>

                    {/* Next Theme — placeholder card */}
                    <div className="rounded-2xl border px-4 py-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Next Theme</span>
                        <span className="text-sm text-gray-600">16/10</span>
                    </div>

                    {/* Title placeholder */}
                    <div className="mt-2 h-5 w-2/3 rounded bg-gray-100" />

                    {/* Thumbnail placeholders */}
                    <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="h-16 rounded-md bg-gray-100" />
                        <div className="h-16 rounded-md bg-gray-100" />
                        <div className="h-16 rounded-md bg-gray-100" />
                    </div>
                    </div>

                    <button className={`w-full block rounded-2xl px-6 py-3
                        ${selected === "" ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-300 border"}`}>
                        Create theme
                    </button>
                    <button className={`w-full block rounded-2xl px-6 py-3
                        ${selected === "submitSample" ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-300 border"}`}
                            onClick={() => setSelected("submitSample")}> Submit Sound Sample
                    </button>
                </div>
                
            </aside>
        </div>






        <h1>Welcome to the Home Page</h1>
        <button onClick={goToMessages}>Messages</button>
        <button onClick={goToThemes}>Themes</button>
    </>
}
