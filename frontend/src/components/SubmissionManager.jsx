import {useEffect, useState} from "react";
import {getThemes} from "../services/themeService.jsx";
import {fullName} from "../services/adminService.jsx";
import {useTranslation} from "react-i18next";
import {t} from "i18next";

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
    const [themes, setThemes] = useState([]);
    //Get the themes
    useEffect(() => {
        async function loadThemes() {
            const items = await getThemes();
            setThemes(items); // just set the raw theme data
        }

        loadThemes();
    }, []);

    const {t} = useTranslation();


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
            <div className={"border-t max-h-150 overflow-auto"}>
                {themes.map(theme => (
                    <Theme item={theme} />
                ))}
            </div>
        </div>

    )
}

function Theme({ item }){
    const [user, setUserName] = useState("");
    const name = item.name

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
    const divcss = "grow m-2 w-1/6  mr-10 ml-10"
    const css = "border text-center"

    return (
        <div className={"m-10 mt-3 mb-3 border rounded flex flex-row justify-between"}>
            <div className={"border m-4 p-2 grow-1 w-1/6 text-center"}>
                {name}
            </div>
            <div className={divcss}>
                <p>{t("Uploaded by")}:</p>
                <p className={css}>{user}</p>
            </div>
            <div className={divcss}>
                <p>{t("Submitted on")}</p>
                <p className={css}>{"6-7"}</p>
            </div>
            <div className={divcss}>
                <p>{t("Seen on")}</p>
                <p className={css}>{"6-7"}</p>
            </div>
            <div className={"text-right ml-5 mr-5 flex flex-col justify-center text-6xl font-thin"}>
                <p>X</p>
            </div>
        </div>
    )
}


function SoundSamples() {
    return "test2"
}

