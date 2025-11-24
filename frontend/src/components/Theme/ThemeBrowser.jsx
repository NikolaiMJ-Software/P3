import { useEffect, useState, useMemo } from "react";
import {addTheme, getThemes, getNewThemes, getOldThemes, deleteTheme} from "../../services/themeService.jsx";
import {getEvents, getFutureEvents} from "../../services/eventService.jsx";
import ThemeCard, {ThemeCreationCard} from "./ThemeCard.jsx";
import ThemeCreationPopup from "./ThemeCreationPopup.jsx";
import { useTranslation } from "react-i18next";
import ThemeToggleButtons from "./Themebrowser/ThemeToggleButtons.jsx";
import ThemeCollection, {UpcomingThemeCollection} from "./Themebrowser/ThemeCollection.jsx";
import EditTheme from "./EditTheme.jsx";


export default function ThemeBrowser({onCreateTheme}) {
    const [themes, setThemes] = useState([]);
    const [events, setEvents] = useState([]);
    const [selected, setSelected] = useState("your")
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [editingTheme, setEditingTheme] = useState(null);
    const [allThemes, setAllThemes] = useState([]);
    const {t} = useTranslation();

    // Load ALL themes once
    useEffect(() => {
        getThemes("all")
            .then(data => {
                console.log("Loaded ALL themes:", data);
                setAllThemes(data || []);
            })
            .catch(err => console.error("Error loading ALL themes:", err));
    }, []);

    // Load filtered themes + events whenever selection or popup changes
    useEffect(() => {
        getThemes(selected)
            .then(data => {
                console.log("Received themes:", data);
                setThemes(data || []);
            })
            .catch(err => {
                console.error("Error loading themes:", err);
                setThemes([]);
            });
    }, [selected, isPopupOpen]);

    useEffect(() =>{
        getFutureEvents().then(data => {
            setEvents(data || []);
        }).catch(err => {
            console.error("Failed fetching events: ", err)
            setEvents([]);
        });
    },[]);


    const handleDeleteTheme = async (id) => {
        try {
        await deleteTheme(id);
        // update UI locally (optional but nice)
        setThemes((prev) => prev.filter((t) => t.themeId !== id));
        } catch (e) {
        console.error("Failed to delete theme", e);
        }
    };

    const getTodaysDate = () =>{
        const today = new Date()
        const year = today.getFullYear()
        const month = today.getMonth() + 1 //getMonth apparently gets 0-11, so we add 1
        const date = today.getDate()
        return (`${year}-${month}-${date}`);
    }
/*
console.log("Themes:", themes);
console.log("Events:", events);
themes.forEach(t => console.log("THEME:", t));
events.forEach(e => console.log("EVENT:", e));

const mergedEvents = useMemo(() => {
    if (!events.length) return [];

    return events.map(ev => {
        const theme = allThemes.find(t => t.themeId === ev.themeId);

        if (!theme) {
            console.warn("No theme for event:", ev);
            return {
                ...ev,
                timestamp: ev.eventDate,
                drinkingRules: [],
                tConsts: [],
                name: "(Unknown Theme)",
                username: "Unknown",
                isSeries: false
            };
        }

        return {
            ...ev,
            ...theme,
            timestamp: ev.eventDate
        };
    });
}, [allThemes, events]);
console.log("Merged events:", mergedEvents);
*/


    return (
        <div className={"p-10"}>
            <div className={"w-full max-w-full h-fit border-2 border-text-primary rounded-3xl p-8"}>

                {/* Upcoming themes card container */}
                <p className={"m-4 font-bold"}>{t("upcoming events")}</p>
                <UpcomingThemeCollection events={events}/>

                <div className={"border-1 m-8"} ></div>

                {/* Top toggle buttons */}
                <ThemeToggleButtons selected={selected} onSelect={setSelected}/>
                {/* Your themes card container */}
                <div className={"pt-4 flex row-end-5 flex gap-5"}>
                    {/* individual cards */}
                    {selected === "your" && (<ThemeCollection isCreator={true} themes={themes} onClick={onCreateTheme} showActions={true} onDelete={handleDeleteTheme} onEdit={(theme) => setEditingTheme(theme)} ></ThemeCollection>)}
                    {editingTheme && (<EditTheme theme={editingTheme} onClose={() => setEditingTheme(null)}/>)}
                    {selected === "old" && (<ThemeCollection isCreator={false} themes={themes} onClick={() => setIsPopupOpen(true)}></ThemeCollection>)}
                    {selected === "new" && (<ThemeCollection isCreator={false} themes={themes} onClick={() => setIsPopupOpen(true)}></ThemeCollection>)}
                </div>
            </div>
        </div>
    )
}