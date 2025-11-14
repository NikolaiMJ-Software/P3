import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import UplaodedSoundSamples from "./SoundSamplesCollection.jsx"
import { getSoundSamples } from "../../services/soundSampleService.jsx";

export default function SoundSampleBrowser() {
    const {t} = useTranslation();
    const { username } = useParams();
    const [usersSS, setUsersSoundSample] = useState([]);
    const [soundSamples, setSoundSample] = useState([]);
    const [sortUsersSSText, setSortUsersText] = useState("latest");
    const [sortAllSSText, setSortAllText] = useState("oldest");

    useEffect(() => {
        load();
    }, [username]);

    async function load(){
        const SS = await getSoundSamples();
        // Filter only users
        const usersSoundSample = SS.filter(
            SS => SS.username.toLowerCase() === username.toLowerCase()
        );
        
        setSoundSample([...SS].reverse());
        setUsersSoundSample(usersSoundSample);
        console.log("All SS: ", SS);
        console.log("Users SS: ", usersSoundSample);
    };
    
    const handleDeleted = () => {
        load();
    };

    const sortSS = (selected) => {
        if (selected === "usersSS") {
            setUsersSoundSample([...usersSS].reverse());
            setSortUsersText(
                sortUsersSSText === "latest" ? "oldest" : "latest"
            );

        } else if (selected === "allSS") {
            setSoundSample([...soundSamples].reverse());
            setSortAllText(
                sortAllSSText === "latest" ? "oldest" : "latest"
            );
        }
    }

    return (
    <div className={"p-10"}>
        <div className={"w-full max-w-full h-fit border-2 border-text-primary rounded-3xl p-8"}>

            {/* Users sound sample card container */}
            <div className="flex justify-between items-center m-4">
                <div className={"m-4 font-bold"}>{t("usersSS")}</div>
                <button className="btn-primary"
                    type="button"
                    onClick={() => sortSS("usersSS")}>
                    {t(sortUsersSSText)}
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                <UplaodedSoundSamples soundSamples={usersSS} witch="users" onDeleted={handleDeleted}/>
            </div>

            <div className={"border-1 m-8"}></div>

            {/* Upcoming themes card container */}
            <div className="flex justify-between items-center m-4">
                <div className={"m-4 font-bold"}>{t("uplSS")}</div>
                <button className="btn-primary"
                    type="button"
                    onClick={() => sortSS("allSS")}>
                    {t(sortAllSSText)}
                </button>
            </div>
            <div className="w-full max-w-full h-auto p-2">
                <UplaodedSoundSamples soundSamples={soundSamples} witch=""/>
            </div>

        </div>
    </div>
    )
}