import {useState} from "react";
import settingsPNG from "../assets/settings.png";

export default function SubmissionManager() {
    const [tab, setTab] = useState("ThemeSubmissions")

    return (
        <div className={"m-5 mt-20 border flex flex-col"}>
            {/* Choose Manager */}
            <div className={"flex flex-row justify-between"}>
                <p onClick={() => setTab("ThemeSubmissions")} className={`grow-1 cursor-pointer text-center p-3 border-r ${(tab === "ThemeSubmissions") ? null : "border-b"}`}> Theme Submissions</p>
                <p onClick={() => setTab("SoundSamples")} className={`grow-1 cursor-pointer text-center p-3 ${(tab === "SoundSamples") ? null : "border-b"}`}> Sound Samples</p>
            </div>
            <div className={""}>
                <p> {getComponent(tab)} </p>
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
    //Get the themes
    const themes = [<Theme/>, <Theme/>,<Theme/>,<Theme/>,<Theme/>,<Theme/>
    ]

    return (
        <div>
            <div className={"p-5 flex flex-row justify-evenly"}>
                {/* Filters and stuff */}
                <div className={"flex flex-col"}>
                    <p>Search for user:</p>
                    <input className={"border"}/>
                </div>
                <div className={"flex flex-col"}>
                    <p>Sort based on:</p>
                    <select className={"border hover:bg-gray-200"}>
                        <option>Latest first</option>
                        <option>Oldest first</option>
                        <option>Alphabetically</option>
                        <option>Length asc</option>
                        <option>Length des</option>
                    </select>
                </div>
                <div className={"flex flex-col"}>
                    <p>Filters:</p>
                    <label>
                        Include voted themes: <input className={"border"} type={"checkbox"}/>
                    </label>
                    <label>
                        Include non-watched themes: <input className={"border"} type={"checkbox"}/>
                    </label>
                </div>
            </div>
            <div className={"border-t"}>
                {themes}
            </div>
        </div>

    )
}

function Theme(){
    return (
        <div className={"m-10 mt-5 mb-5 border rounded flex flex-row justify-between"}>
            <div>
                hello
            </div>
            <div>
                hello
            </div>
            <div>
                hello
            </div>
        </div>
    )
}


function SoundSamples() {
    return "test2"
}

