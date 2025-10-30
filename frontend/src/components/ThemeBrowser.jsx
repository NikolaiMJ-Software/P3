import { useEffect, useState } from "react";
import {getThemes} from "../services/themeService.jsx";
import ThemeCard, {ThemeCreationCard} from "./ThemeCard.jsx";
import SoundSampleBrowser from "./SoundSampleBrowser.jsx";

export default function ThemeBrowser() {
    const [themes, setThemes] = useState([]);
    const [selected, setSelected] = useState("your")
    useEffect(() => {
        getThemes().then(setThemes)
    },[])

    return (
        <div className={"m-10"}>
            <div className={"w-300 h-fit border-2 border-black rounded-3xl p-8"}>
                {/* Upcoming themes card container */}
                <p className={"m-4 font-bold"}>Upcoming themes</p>
                <div className={"flex gap-5 p-4 overflow-x-auto"}>
                    {/* individual cards */}
                    <ThemeCreationCard></ThemeCreationCard>
                    <ThemeCard drinkingRules={["Take a sip when they say Arrr", "Take a sip when they say matey"]} title={"Pirates Night"} name={"Kabuum"} tConsts={["tt0325980", "tt0383574"]}></ThemeCard>
                </div>
                <div className={"border-1 m-8"}></div>
                {/* Top toggle buttons */}
                <div className={"flex gap-4"}>
                    <button className={`px-6 py-3 rounded-2xl transition-colors
            ${selected === "your" ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-300"}`}
                            onClick={() => setSelected("your")}>Your themes</button>
                    <button className={`px-6 py-3 rounded-2xl transition-colors
            ${selected === "new" ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-300"}`}
                            onClick={() => setSelected("new")}>New themes</button>
                    <button className={`px-6 py-3 rounded-2xl transition-colors
            ${selected === "old" ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-300"}`}
                            onClick={() => setSelected("old")}>Old themes</button>
                </div>
                <div>
                    {selected === "your" ? <h1>your oneees</h1> : selected === "new" ? <h1> new oneees</h1> : <h1>old oneees</h1>}
                </div>
                <p className={"m-4 font-bold"}>Your themes</p>
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