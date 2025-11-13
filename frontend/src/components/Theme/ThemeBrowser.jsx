import { useEffect, useState } from "react";
import {addTheme, getThemes, getNewThemes, getOldThemes} from "../../services/themeService.jsx";
import ThemeCard, {ThemeCreationCard} from "./ThemeCard.jsx";
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
        getThemes(selected).then(data => {
            console.log("Selected:", selected);
            console.log("Received themes:", data);
            setThemes(data);
        }).catch(err => console.error("Error loading themes:", err));
    },[selected])


    const getTodaysDate = () =>{
        const today = new Date()
        const year = today.getFullYear()
        const month = today.getMonth() + 1 //getMonth apparently gets 0-11, so we add 1
        const date = today.getDate()
        return (`${year}-${month}-${date}`);
    }

    return (
        <div className={"p-10"}>
            <ThemeCreationPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
            />
            <div className={"w-full max-w-full h-fit border-2 border-text-primary rounded-3xl p-8"}>

                {/* Upcoming themes card container */}
                <p className={"m-4 font-bold"}>{t("upcoming themes")}</p>
                <UpcomingThemeCollection themes={themes}/>

                <div className={"border-1 m-8"} ></div>

                {/* Top toggle buttons */}
                <ThemeToggleButtons selected={selected} onSelect={setSelected}/>
                {/* Your themes card container */}
                <div className={"pt-4 pl-6 flex row-end-5 flex gap-5"}>
                    {/* individual cards */}
                    {selected === "your" && (<ThemeCreationCard onClick={() => setIsPopupOpen(true)} />
                    )}
                    <ThemeCollection isCreator={true} themes={themes}></ThemeCollection>
                </div>

            </div>
        </div>
    )
}