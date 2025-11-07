import { useEffect, useState } from "react";
import {addTheme, getThemes} from "../../services/themeService.jsx";
import ThemeCard, {ThemeCreationCard} from "./ThemeCard.jsx";
import SoundSampleBrowser from "../SoundSampleBrowser.jsx";
import ThemeCreationPopup from "./ThemeCreationPopup.jsx";
import { useTranslation } from "react-i18next";
import ThemeToggleButtons from "./Themebrowser/ThemeToggleButtons.jsx";

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
                <div className={"flex gap-5 p-4 overflow-x-auto"}>
                    {/* individual cards */}
                    <ThemeCreationCard onClick={() => setIsPopupOpen(true)}></ThemeCreationCard>
                    <ThemeCard drinkingRules={["Take a sip when they say Arrr", "Take a sip when they say matey"]} title={"Pirates Night"} name={"Kabuum"} tConsts={["tt0325980", "tt0383574"]}></ThemeCard>
                </div>
                <div className={"border-1 m-8"} ></div>
                {/* Top toggle buttons */}
                <ThemeToggleButtons selected={selected} onSelect={setSelected}/>

                <div>
                    {selected === "your" ? <h1>t{("your themes")}</h1> : selected === "new" ? <h1> new oneees</h1> : <h1>old oneees</h1>}
                </div>
                {/* Your themes card container */}
                <div className={"pt-4 pl-6 flex row-end-5 flex gap-5"}>
                    {/* individual cards */}
                    <div className={"flex gap-5 p-4 overflow-x-auto"}>
                        {/* individual cards */}
                        <div className={"w-60 h-80 border-2 border-black" +
                            "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>Create theme</div>
                        <div className={"w-60 h-80 border-2 border-black" +
                            "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>theme</div>
                    </div>
                </div>
            </div>
        </div>
    )
}