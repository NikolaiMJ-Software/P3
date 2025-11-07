import { useEffect, useState } from "react";
import {addTheme, getThemes} from "../../services/themeService.jsx";
import ThemeCard, {ThemeCreationCard} from "./ThemeCard.jsx";
import SoundSampleBrowser from "../SoundSampleBrowser.jsx";
import ThemeCreationPopup from "./ThemeCreationPopup.jsx";
import { useTranslation } from "react-i18next";
import ThemeToggleButtons from "./Themebrowser/ThemeToggleButtons.jsx";
import ThemeCollection from "./Themebrowser/ThemeCollection.jsx";

export default function ThemeBrowser() {
    const [themes, setThemes] = useState([]);
    const [selected, setSelected] = useState("your")
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const {t} = useTranslation();

    useEffect(() => {
        getThemes().then(setThemes)
    },[])

    const handleCreateTheme = async (themeData) => {
        try {
            //extract data
            const name = themeData.title;
            const username = themeData.userId;
            const tConsts = themeData.movies.map(m=> m.tConsts);
            const drinkingRules = themeData.rules || "";

            await addTheme(name, username, tConsts, drinkingRules);

            //refresh the list
            const updatedThemes = await getThemes();
            setThemes(updatedThemes);

            setIsPopupOpen(false);
            alert("Theme created sucessfully! ");
        } catch (error) {
            console.error("Error creating theme:", error);
            alert("failed to create theme");
        }

    }

    return (
        <div className={"p-10"}>
            <ThemeCreationPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onSubmit={handleCreateTheme}
            />
            <div className={"w-full max-w-full h-fit border-2 border-black rounded-3xl p-8"}>
                {/* Upcoming themes card container */}
                <p className={"m-4 font-bold"}>Upcoming themes</p>
                <ThemeCollection themes={themes}/>
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