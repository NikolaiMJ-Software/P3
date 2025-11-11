import { useEffect, useState } from "react";
import {addTheme, getThemes} from "../../services/themeService.jsx";
import ThemeCard, {ThemeCreationCard} from "./ThemeCard.jsx";
import SoundSampleBrowser from "../SoundSampleBrowser.jsx";
import ThemeCreationPopup from "./ThemeCreationPopup.jsx";
import { useTranslation } from "react-i18next";
import ThemeToggleButtons from "./Themebrowser/ThemeToggleButtons.jsx";
import ThemeCollection, {UpcomingThemeCollection} from "./Themebrowser/ThemeCollection.jsx";

export default function ThemeBrowser() {
    const [themes, setThemes] = useState([]);
    const [selected, setSelected] = useState("your")
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const {t} = useTranslation();

    useEffect(() => {
        getThemes().then(setThemes)
    },[])


    return (
        <div className={"p-10"}>
            <ThemeCreationPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
            />
            <div className={"w-full max-w-full h-fit border-2 border-black rounded-3xl p-8"}>

                {/* Upcoming themes card container */}
                <p className={"m-4 font-bold"}>{t("upcoming themes")}</p>
                <UpcomingThemeCollection themes={themes}/>

                <div className={"border-1 m-8"} ></div>

                {/* Top toggle buttons */}
                <ThemeToggleButtons selected={selected} onSelect={setSelected}/>
                <div>
                    {selected === "your" ? <h1>{t("your themes")}</h1> : selected === "new" ? <h1>{t("new themes")}</h1> : <h1>{t("old themes")}</h1>}
                </div>
                {/* Your themes card container */}
                <div className={"pt-4 pl-6 flex row-end-5 flex gap-5"}>
                    {/* individual cards */}
                    <ThemeCollection isCreator={true} onClick={() => setIsPopupOpen(true)} themes={themes}></ThemeCollection>
                </div>

            </div>
        </div>
    )
}