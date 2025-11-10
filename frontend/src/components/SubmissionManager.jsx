import {useEffect, useState} from "react";
import {getThemes} from "../services/themeService.jsx";
import {fullName} from "../services/adminService.jsx";
import {useTranslation} from "react-i18next";
import {t} from "i18next";
import {getMovies} from "../services/movieService.jsx";

export default function SubmissionManager() {
    const [tab, setTab] = useState("ThemeSubmissions")
    const {t} = useTranslation();

    return (
        <div className={"m-5 mt-20 border flex flex-col"}>
            {/* Choose Manager */}
            <div className={"flex flex-row justify-between"}>
                <p onClick={() => setTab("ThemeSubmissions")} className={`w-1/2 cursor-pointer text-center p-3 border-r ${(tab === "ThemeSubmissions") ? null : "border-b"}`}> {t("themes")}</p>
                <p onClick={() => setTab("SoundSamples")} className={`w-1/2 cursor-pointer text-center p-3 ${(tab === "SoundSamples") ? null : "border-b"}`}> {t("sound samples")}</p>
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
            component = <SoundSamples/>;
            break;
    }
    return component;
}

function ThemeSubmissions(){
    const {t} = useTranslation();
    const [themes, setThemes] = useState([]);
    const [expandedTheme, setExpandedTheme] = useState(null)
    //Get the themes
    useEffect(() => {
        async function loadThemes() {
            const items = await getThemes();
            setThemes(items); // just set the raw theme data
        }

        loadThemes();
    }, []);

    const toggleTheme = (id) => {
        setExpandedTheme(expandedTheme === id ? null : id);
    };



    return (
        <div>
            <div className={"p-5 flex flex-row justify-evenly"}>
                {/* Filters and stuff */}
                <div className={"flex flex-col"}>
                    <p>{t("search for")} {t("user")}:</p>
                    <input className={"border"}/>
                </div>
                <div className={"flex flex-col"}>
                    <p>{t("sort based on")}:</p>
                    <select className={"border hover:bg-gray-200"}>
                        <option>{t("latest")}</option>
                        <option>{t("oldest")}</option>
                        <option>{t("alphabetical")}</option>
                        <option>{t("length")} asc</option>
                        <option>{t("length")} des</option>
                    </select>
                </div>
                <div className={"flex flex-col"}>
                    <p>{t("filters")}:</p>
                    <label>
                        {t("include")} {t("voted")} {t("themes")}: <input className={"border"} type={"checkbox"}/>
                    </label>
                    <label>
                        {t("include")} {t("non-watched")} {t("themes")}: <input className={"border"} type={"checkbox"}/>
                    </label>
                </div>
            </div>
            <div className={"border-t max-h-135 overflow-auto"}>
                {themes.map(theme => (
                    <Theme item={theme} isExpanded={expandedTheme === theme.themeId} onToggle={() => toggleTheme(theme.themeId)}/>
                ))}
            </div>
        </div>

    )
}

function Theme({ item, onToggle, isExpanded }){
    const [user, setUserName] = useState("");
    const [movies, setMovies] = useState([])
    const [loaded, setLoaded] = useState(false);
    const name = item.name
    console.log(`${item.themeId} ${isExpanded}`)

    useEffect(() => {
        async function loadName(){
            try{
                fullName(item.userId).then(setUserName)
            } catch (e){
                console.error("Error loading user name:", e)
                setUserName("error")
            }
        }
        loadName()
    }, []);

    const loadMovies = async () => {
        await getMovies(item.movieIds).then(setMovies)
        setLoaded(true)
    }

    const handleClick = async () => {
        if (!loaded) await loadMovies();
        console.log(movies)
        onToggle();
    }

    return (
        <div className={"m-10 mt-3 mb-3 border rounded flex flex-col"}>
            <div className={"flex flex-row justify-between cursor-pointer"} onClick={handleClick}>
                <div className={"border m-4 p-2 grow-1 w-1/6 text-center"}>
                    {name}
                </div>
                <ThemePart label={t("Uploaded by")} content={user}/>
                <ThemePart label={t("Submitted on")} content={"6-7"}/>
                <ThemePart label={t("Seen on")} content={"6-7"}/>
                <div className={"text-right ml-5 mr-5 flex flex-col justify-center text-6xl font-thin"}>
                    <p className={"cursor-pointer"} onClick={() => console.log("Hello World!")}>X</p>
                </div>
            </div>
            {isExpanded && (
                <div className="bg-gray-50 border-t p-4 flex flex-row overflow-auto">
                    {movies.map((movie) => (
                        <div className="flex justify-between items-center rounded border m-2 p-1">
                            <div className={"flex flex-col items-center min-w-40"}>
                                <p className="font-bold text-center">{movie.title}</p>
                                <img src={movie.moviePosterURL} className={"h-60 w-40"}/>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function ThemePart({ label, content}){
    return (
        <div className={"grow m-2 w-1/6  mr-10 ml-10"}>
            <p>{label}</p>
            <p className={"border text-center"}>{content}</p>
        </div>
    )
}


function SoundSamples() {
    return "test2"
}

