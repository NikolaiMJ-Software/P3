import { useEffect, useState } from "react";
import {getThemes} from "../services/themeService.jsx";
import ThemeCard from "../components/ThemeCard.jsx";

export default function ThemeBrowser() {
    const [themes, setThemes] = useState([]);
    useEffect(() => {
        getThemes().then(setThemes)
    },[])

    return (<>
        <h1>Themes</h1>
        {themes.map((theme) => {
            return <ThemeCard
                key={theme.id}
                title={theme.name}
                name={"Martin"}// should find a user's name instead, replaced for testing purpose
                drinkingRules={theme.drinkingRules ?? []}
                movieIds={theme.movieIds}
            ></ThemeCard>
        })}
    </>)
}