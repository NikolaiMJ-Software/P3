import {useEffect, useState} from "react";
import {getThemes} from "../services/themeService.jsx";
import {fullName} from "../services/adminService.jsx";

export default function SubmissionManager() {
    const [tab, setTab] = useState("ThemeSubmissions")

    return (
        <div className={"m-5 mt-20 border flex flex-col"}>
            {/* Choose Manager */}
            <div className={"flex flex-row justify-between"}>
                <p onClick={() => setTab("ThemeSubmissions")} className={`grow-1 cursor-pointer text-center p-3 border-r ${(tab === "ThemeSubmissions") ? null : "border-b"}`}> Film Forslag</p>
                <p onClick={() => setTab("SoundSamples")} className={`grow-1 cursor-pointer text-center p-3 ${(tab === "SoundSamples") ? null : "border-b"}`}> Lydprøveforslag</p>
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
    const [name, setName] = useState("")
    //Get the themes
    useEffect(() => {
        async function load() {
            const items = await getThemes();
            const userNames = await Promise.all(
                items.map(async item => {
                    const userName = await fullName(item.userId);
                    return <Theme key={item.themeId} name={item.name} user={userName} timestamp={item.timestamp}/>
                })
            )
            setThemes(userNames)
        }
        load()
    },[])


    return (
        <div>
            <div className={"p-5 flex flex-row justify-evenly"}>
                {/* Filters and stuff */}
                <div className={"flex flex-col"}>
                    <p>Søg efter bruger:</p>
                    <input className={"border"}/>
                </div>
                <div className={"flex flex-col"}>
                    <p>Sorter baseret på:</p>
                    <select className={"border hover:bg-gray-200"}>
                        <option>Seneste</option>
                        <option>Ældste</option>
                        <option>Alfabetisk</option>
                        <option>Længde asc</option>
                        <option>Længde des</option>
                    </select>
                </div>
                <div className={"flex flex-col"}>
                    <p>Filtre:</p>
                    <label>
                        Inkluder stemte forslag: <input className={"border"} type={"checkbox"}/>
                    </label>
                    <label>
                        Inkluder ikke-set forslag: <input className={"border"} type={"checkbox"}/>
                    </label>
                </div>
            </div>
            <div className={"border-t"}>
                {themes}
            </div>
        </div>

    )
}

function Theme({ key, name, user, timestamp}){
    return (
        <div className={"m-10 mt-5 mb-5 border rounded flex flex-row justify-between"}>
            <div>
                {name}
            </div>
            <div>
                {user}
            </div>
            <div>
                {timestamp}
            </div>
        </div>
    )
}


function SoundSamples() {
    return "test2"
}

