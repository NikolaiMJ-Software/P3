import {useNavigate, useParams} from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import ThemeBrowser from "../components/Theme/ThemeBrowser.jsx";
import SoundSampleBrowser from "../components/SoundSamples/SoundSampleBrowser.jsx";
import SubmitSSPage from "../components/SoundSamples/SubmitSSPage.jsx";
import NextTheme from "../components/Theme/NextTheme";
import { useTranslation } from "react-i18next";
import React from "react";
import ThemeCreationPopup from "../components/Theme/ThemeCreationPopup.jsx";


export default function HomePage() {
    const navigate = useNavigate();
    const {username: routeUsername} = useParams();
    const [selected, setSelected] = useState("themes")
    const {t} = useTranslation();

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
            <button className={`btn-home-page
            ${selected === "themes" ? "" : "btn-secondary"}`}
                    onClick={() => setSelected("themes")}>{t("themes")}</button>
            <button className={`btn-home-page
            ${selected === "samples" ? "" : "btn-secondary"}`}
                    onClick={() => setSelected("samples")}>{t("sound sample")}</button>
        </div>

        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-9 min-w-0 overflow-hidden"> {
                selected === "themes" ? (
                    <ThemeBrowser onCreateTheme={() => setSelected("createTheme")} />
                ) : selected === "samples" ? (
                    <SoundSampleBrowser onCreateSS={() => setSelected("submitSample")}/>
                ) : selected === "createTheme" ? (
                    <ThemeCreationPopup setSelected={setSelected}/>
                ) : selected === "submitSample" ? (
                    <SubmitSSPage />
                ) : null
            }
            </div>
            <aside className="col-span-12 lg:col-span-3 lg:ml-2 pt-10">
                <div className="sticky top-10 flex flex-col gap-4 z-10">
                    <button className="btn-home-page w-full block"
                        onClick={() => {navigate(`/faq/${user}`)}}>
                        Info
                    </button>

                    {/* Next Theme — placeholder card */}
                    <NextTheme
                    dateLabel="13/11"
                    title="Comical Horror Movies"
                    posters={[
                        "https://m.media-amazon.com/images/M/MV5BNTBhNWJjZWItYzY3NS00M2NkLThmOWYtYTlmNzBmN2UxZWFjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
                        "https://m.media-amazon.com/images/M/MV5BMTAxNGQwMjEtNjdjNy00NmQwLTkwYTEtNGIwZWJjZjU5M2FmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
                        "https://m.media-amazon.com/images/M/MV5BNzJjZTg0ZmMtMTg0Ny00NzYxLWFjMWMtMWFiYmNkMTNjZGMyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
                    ]}
                    />


                    <button className={`btn-home-page
                        ${selected === "createTheme" ? "" : "btn-secondary"}`}
                            onClick={() => setSelected("createTheme")}> {t("create")} {t("theme")}
                        
                    </button>
                    <button className={`btn-home-page
                        ${selected === "submitSample" ? "" : "btn-secondary"}`}
                            onClick={() => setSelected("submitSample")}> {t("submit")} {t("sound sample")}
                    </button>
                </div>
                
            </aside>
        </div>
    </>
}
