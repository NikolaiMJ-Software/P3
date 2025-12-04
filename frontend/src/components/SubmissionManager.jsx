import {useEffect, useState} from "react";
import trashCan from "../assets/trashCan.png"
import {fullName} from "../services/adminService.jsx";
import {t} from "i18next";
import {getMovies} from "../services/movieService.jsx";
import { API } from "../services/api.jsx"
import {deleteSoundSample, getSoundSamples} from "../services/soundSampleService.jsx";
import {deleteTheme, getNewThemes, getOldThemes} from "../services/themeService.jsx";

export default function SubmissionManager() {
    const [tab, setTab] = useState("ThemeSubmissions")

    return (
        <div className={"m-5 mt-20 border flex flex-col"}>
            {/* Choose Manager */}
            <div className={"flex flex-row justify-between"}>
                <p onClick={() => setTab("ThemeSubmissions")} className={`bg-primary w-1/2 cursor-pointer text-center p-3 border-r ${(tab === "ThemeSubmissions") ? null : "border-b"}`}> {t("themes")}</p>
                <p onClick={() => setTab("SoundSamples")} className={`bg-primary w-1/2 cursor-pointer text-center p-3 ${(tab === "SoundSamples") ? null : "border-b"}`}> {t("sound samples")}</p>
            </div>
            <div className={""}>
                {getComponent(tab)}
            </div>
        </div>
    )
}



function getComponent(currentComponent){
    let component;
    switch (currentComponent){
        case 'ThemeSubmissions' :
            component = <ThemeSubmissions/>;
            break;
        case 'SoundSamples' :
            component = <SoundSampleSubmissions/>;
            break;
    }
    return component;
}

function ThemeSubmissions(){
    const [themes, setThemes] = useState([]);
    const [expandedTheme, setExpandedTheme] = useState(null)
    const [oldThemes, setOldThemes] = useState([])
    const [newThemes, setNewThemes] = useState([])
    const [currentSort, setCurrentSort] = useState("oldest")

    // Filtering
    const [searchName, setSearchName] = useState("")
    const [hideOld, setHideOld] = useState(true)
    const [hideNew, setHideNew] = useState(false)

    //Get the themes
    async function loadThemes() {
        const items = await fetch(API + "/themes").then(e => e.json());
        console.log(items)
        await Promise.all(
            items.map(async item => {
                item.username = await fullName(item.userId);
            })
        )
        //return the array
        setThemes(items);
    }

    useEffect(() => {
        loadThemes();
        getOldThemes().then(setOldThemes)
        getNewThemes().then(setNewThemes)
    }, []);

    async function themeDelete(id) {
        const youSureQuestionmark = window.confirm(t("youSure"));
        if (!youSureQuestionmark) return;
        await deleteTheme(id).then(loadThemes)
    }


    //Filter time
    const filteredThemes = themes.filter(theme => {
        // Check if theme is old
        if (hideOld) if (oldThemes.some(t => t.themeId === theme.themeId)) return false
        
        // Check if theme is new
        if (hideNew){
            if (newThemes.some(t => t.themeId === theme.themeId)) return false
        }

        return theme.username.toLowerCase().includes(searchName.toLowerCase()) || theme.name.toLowerCase().includes(searchName.toLowerCase());
        }
    );

    const sortedThemes = filteredThemes.toSorted((a,b) => {
        switch (currentSort){
            case "latest": {
                const aTime = a.timestamp.split("T")[0].split("-");
                const bTime = b.timestamp.split("T")[0].split("-");
                return (bTime[0]-aTime[0] === 0) ? (bTime[1]-aTime[1] === 0) ? bTime[2]-aTime[2] : bTime[1]-aTime[1] : bTime[0]-aTime[0]
            }
            case "oldest": {
                const aTime = a.timestamp.split("T")[0].split("-");
                const bTime = b.timestamp.split("T")[0].split("-");
                return (aTime[0]-bTime[0] === 0) ? (aTime[1]-bTime[1] === 0) ? aTime[2]-bTime[2] : aTime[1]-bTime[1] : aTime[0]-bTime[0]
            }
            case "alpha asc": {
                return a.name > b.name
            }
            case "alpha des": {
                return a.name < b.name
            }
        }
    })
    


    const toggleTheme = (id) => {
        setExpandedTheme(expandedTheme === id ? null : id);
    };

    return (
        <div>
            <div className={"bg-primary p-5 flex flex-row justify-evenly"}>
                {/* Filters and stuff */}
                <div className={"flex flex-col"}>
                    <p>{t("search for")} {t("user")}:</p>
                    <input onChange={e => setSearchName(e.target.value)} className={"border"}/>
                </div>
                <div className={"flex flex-col"}>
                    <p>{t("sort based on")}:</p>
                    <select className={"border hover:bg-btn-hover-secondary"} defaultValue={currentSort} onChange={e => setCurrentSort(e.target.value)}>
                        <option value={"latest"}>{t("latest")}</option>
                        <option value={"oldest"}>{t("oldest")}</option>
                        <option value={"alpha asc"}>{t("alphabetical")} asc</option>
                        <option value={"alpha des"}>{t("alphabetical")} des</option>
                    </select>
                </div>
                <div className={"flex flex-col"}>
                    <p>{t("filters")}:</p>
                    <label>
                        {t("hide")} {t("old themes")}: <input className={"border"} type={"checkbox"} onChange={() => setHideOld(!hideOld)} checked={hideOld}/>
                    </label>
                    <label>
                        {t("hide")} {t("new themes")}: <input className={"border"} type={"checkbox"} onChange={() => setHideNew(!hideNew)} checked={hideNew}/>
                    </label>
                </div>
            </div>
            <div className={"bg-primary border-t h-135 overflow-auto"}>
                {sortedThemes.map(theme => (
                    <Theme item={theme} isExpanded={expandedTheme === theme.themeId} onToggle={() => toggleTheme(theme.themeId)} onDelete={() => themeDelete(theme.themeId)}/>
                ))}
            </div>
        </div>

    )
}

function Theme({ item, onToggle, isExpanded, onDelete }){
    const [movies, setMovies] = useState([])
    //const [loaded, setLoaded] = useState(false)

    const handleClick = async () => {
        await getMovies(item.movieIds).then(setMovies)
        onToggle();
    }

    const timestamp = item.timestamp.split("T")[0]

    return (
        <div className={"m-10 mt-3 mb-3 border rounded flex flex-col"}>
            <div className={"bg-primary flex flex-row justify-between cursor-pointer"} onClick={handleClick}>
                <div className={"bg-primary border m-4 p-2 grow-1 w-1/6 text-center"}>
                    {item.name}
                </div>
                <SubmissionPart label={t("Uploaded by")} content={item.username}/>
                <SubmissionPart label={t("Submitted on")} content={timestamp.split("-").reverse().join("-")}/>
                <div className={"text-right ml-5 mr-5 flex flex-col justify-center text-4xl font-thin"}>
                    <img className={"cursor-pointe size-10 hover:bg-gray-300 rounded p-1"} src={trashCan} alt={"Delete"} onClick={onDelete}/>
                </div>
            </div>
            {isExpanded && (
                <div className="border-t p-4 flex flex-row overflow-auto">
                    {movies.map((movie) => (
                        <div className="flex justify-between items-center rounded border m-2 p-1">
                            <div className={"flex flex-col items-center min-w-40"}>
                                <p className="font-bold text-center max-w-80">{movie.title}</p>
                                <img src={movie.moviePosterURL} className={"h-60 w-40"}/>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function SubmissionPart({ label, content}){
    return (
        <div className={"grow m-2 w-1/6  mr-10 ml-10"}>
            <p>{label}</p>
            <p className={"bg-primary border text-center"}>{content}</p>
        </div>
    )
}


function SoundSampleSubmissions() {
    const [samples, setSamples] = useState([]);
    const [searchName, setSearchName] = useState("")
    const [toBeDeleted, setDeletion] = useState([])
    const [currentSort, setCurrentSort] = useState("latest")

    //Get the soundSamples
    async function loadSamples() {
        const items = await getSoundSamples();
        console.log(items)
        //return the array
        setSamples(items);
    }

    useEffect(() => {
        loadSamples();
    }, []);

    //Filter time
    const filteredSamples = samples.filter(sample =>
        sample.usersFullName.toLowerCase().includes(searchName.toLowerCase())
    );

    const sortedSamples = filteredSamples.toSorted((a,b) => {
        switch (currentSort){
            case "latest": {
                return a.id - b.id
            }
            case "oldest": {
                return b.id - a.id
            }
            case "alpha asc": {
                return a.soundSample > b.soundSample
            }
            case "alpha des": {
                return a.soundSample < b.soundSample
            }
        }
    })

    const addToDelete = (object) => {
        console.log(object)
        if (toBeDeleted === undefined) return
        setDeletion(arr => {
            return arr.some(({ id }) => id === object.id)
                ? arr.filter(item => item.id !== object.id)
                : [...arr, object]
        })
        console.log(toBeDeleted)
    }

    async function batchDelete() {
        console.log(toBeDeleted)
        if (!toBeDeleted.length) return;
        const youSureQuestionmark = window.confirm(t("youSure"));
        if (!youSureQuestionmark) return;

        // Create an array of promises
        const deletePromises = toBeDeleted.map(sample => deleteSoundSample(sample.soundSample, sample.id)
        );

        // Wait until all deletions are finished
        await Promise.all(deletePromises);

        setDeletion([]);
        await loadSamples();
    }

    return (
        <div>
            <div className={"bg-primary p-5 flex flex-row justify-evenly"}>
                {/* Filters and stuff */}
                <div className={"flex flex-col"}>
                    <p>{t("search for")} {t("user")}:</p>
                    <input onChange={e => setSearchName(e.target.value)} className={"border"}/>
                </div>
                <div className={"flex flex-col"}>
                    <p>{t("sort based on")}:</p>
                    <select className={"border hover:bg-btn-hover-secondary"} onChange={e => setCurrentSort(e.target.value)}>
                        <option value={"latest"}>{t("latest")}</option>
                        <option value={"oldest"}>{t("oldest")}</option>
                        <option value={"alpha asc"}>{t("alphabetical")} asc</option>
                        <option value={"alpha des"}>{t("alphabetical")} des</option>
                    </select>
                </div>
                <div className={"text-right ml-5 mr-5 flex flex-col justify-center text-4xl font-thin"}>
                    <img className={"cursor-pointer size-12 hover:bg-gray-300 rounded p-1"} onClick={batchDelete} src={trashCan} alt={"Delete Selected"}/>
                </div>
            </div>
            <div className={"bg-primary border-t h-135 overflow-auto"}>
                {sortedSamples.map(sample => (
                    <SoundSample item={sample} onCheck={addToDelete}/>
                ))}
            </div>
        </div>

    )
}

function SoundSample({ item, onCheck }) {
    return (
        <div className={"m-10 mt-3 mb-3 border rounded flex flex-row justify-between"}>
            {/* File name */}
            <SubmissionPart content={item.soundSample}/>
            {/* File Type */}
            {/* User */}
            <SubmissionPart content={item.usersFullName}/>
            {/* Checkbox */}
            <input className={"m-2 size-6"} type={"checkbox"} onChange={() => onCheck({ id: item.id, soundSample: item.soundSample})}/>
        </div>
    )
}
