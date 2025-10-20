import { useEffect, useState } from "react";
import {getThemes} from "../services/themeService.jsx";
import ThemeCard from "../components/ThemeCard.jsx";

export default function ThemeBrowser() {
    const [themes, setThemes] = useState([]);
    useEffect(() => {
        getThemes().then(setThemes)
    },[])

    return (<>
        {themes.map((theme) => {
            return <ThemeCard
                key={theme.id}
                title={theme.title}
                name={theme.name}
                drinkingRules={theme.drinkingRules}
                movieIds={theme.movieIds}
            ></ThemeCard>
        })}
    </>)
}