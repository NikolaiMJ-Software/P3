import React, { useEffect, useState, useMemo } from "react";
import {addTheme, getThemes, getNewThemes, getOldThemes, deleteTheme} from "../../services/themeService.jsx";
import {getEvents, getFutureEvents} from "../../services/eventService.jsx";
import ThemeCard, {ThemeCreationCard} from "./ThemeCard.jsx";
import ThemeCreationPopup from "./ThemeCreationPopup.jsx";
import { useTranslation } from "react-i18next";
import ThemeToggleButtons from "./Themebrowser/ThemeToggleButtons.jsx";
import ThemeCollection, {UpcomingThemeCollection} from "./Themebrowser/ThemeCollection.jsx";
import EditTheme from "./EditTheme.jsx";

/**
 * ThemeBrowser
 * Main page for browsing themes and upcoming events.
 * Lets the user switch between "your", "new", and "old" theme collections,
 * and provides edit/delete actions for the user's own themes.
 */
export default function ThemeBrowser({onCreateTheme}) {
    const [themes, setThemes] = useState([]);
    const [events, setEvents] = useState([]);
    const [selected, setSelected] = useState("your")
    const [editingTheme, setEditingTheme] = useState(null);
    const [allThemes, setAllThemes] = useState([]);
    const [mode, setMode] = useState("browse"); 
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

    // Load themes based on selected filter ("your" / "new" / "old")
    // Re-run after selection changes or after editing to refresh the list
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
    }, [selected, editingTheme]);

    // Load upcoming events once
    useEffect(() =>{
        getFutureEvents().then(data => {
            setEvents(data || []);
        }).catch(err => {
            console.error("Failed fetching events: ", err)
            setEvents([]);
        });
    },[]);

    // Delete theme and remove it from local state
    const handleDeleteTheme = async (id) => {
        const youSureQuestionmark = window.confirm(t("youSure"));
        if (!youSureQuestionmark) return;
        try {
        await deleteTheme(id);
        // update UI locally
        setThemes((prev) => prev.filter((t) => t.themeId !== id));
        } catch (e) {
        console.error("Failed to delete theme", e);
        }
    };

    // Edit mode: show the edit screen instead of the browser UI
    if (mode === "edit") {
        return (
            <EditTheme theme={editingTheme} onClose={() => {setEditingTheme(null); setMode("browse");}}/>
        );
    }

    return (
        <div className={"p-1 sm:p-10"}>
            
            <div className={"bg-primary drop-shadow-xl w-full max-w-full h-fit border-2 border-text-primary rounded-3xl p-1.5 sm:p-8"}>

                {/* Upcoming themes card container */}
                <p className={"m-4 text-sm sm:text-base font-bold"}>{t("upcoming events")}</p>
                <UpcomingThemeCollection events={events}/>

                <div className={"border-1 m-4 sm:m-8"} ></div>

                {/* Top toggle buttons */}
                <ThemeToggleButtons selected={selected} onSelect={setSelected}/>
                {/* Your themes card container */}
                <div className={"pt-2 sm:pt-4 flex row-end-5 flex gap-5"}>
                    {/* individual cards */}
                    {selected === "your" && (<ThemeCollection isCreator={true} themes={themes} onClick={onCreateTheme} showActions={true} onDelete={handleDeleteTheme} onEdit={(theme) => {setEditingTheme(theme); setMode("edit");}} ></ThemeCollection>)}
                    {selected === "old" && (<ThemeCollection isCreator={false} themes={themes}></ThemeCollection>)}
                    {selected === "new" && (<ThemeCollection isCreator={false} themes={themes}></ThemeCollection>)}
                </div>
            </div>
        </div>
    )
}