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
    const [allVisibleCount, setAllVisibleCount] = useState(4);
    const [usersVisibleCount, setUsersVisibleCount] = useState(4);

    useEffect(() => {
        load();
    }, [username]);

    // Get all sound samples
    async function load(){
        const SS = await getSoundSamples();
        // Filter only login users sound samples
        const usersSoundSample = SS.filter(
            SS => SS.username.toLowerCase() === username.toLowerCase()
        );
        
        setSoundSample([...SS].reverse());
        setUsersSoundSample(usersSoundSample);
        console.log("All SS: ", SS);
        console.log("Users SS: ", usersSoundSample);
    };
    
    // Reload page
    const handleDeleted = () => {
        load();
    };

    // Sort from oldest to newest and vice versa
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
                <UplaodedSoundSamples soundSamples={usersSS} witch="users" onDeleted={handleDeleted} showenCard={usersVisibleCount}/>
            </div>
            <div className="flex justify-center p-2">
                <button className={"btn-primary" + (usersVisibleCount < usersSS.length ? " block" : " hidden")}
                    type="button"
                    onClick={() => setUsersVisibleCount(usersVisibleCount + 20)}> {/*Add 20 more sound samples*/}
                    {t("loadMore")}
                </button>
            </div>

            <div className={"border-1 m-8"}></div>

            {/* All sound samples card container */}
            <div className="flex justify-between items-center m-4">
                <div className={"m-4 font-bold"}>{t("uplSS")}</div>
                <button className="btn-primary"
                    type="button"
                    onClick={() => sortSS("allSS")}>
                    {t(sortAllSSText)}
                </button>
            </div>
            <div className="w-full max-w-ful">
                <UplaodedSoundSamples soundSamples={soundSamples} witch="" showenCard={allVisibleCount}/>
            </div>
            <div className="flex justify-center p-2">
                <button className={"btn-primary" + (allVisibleCount < soundSamples.length ? " block" : " hidden")}
                    type="button"
                    onClick={() => setAllVisibleCount(allVisibleCount + 20)}> {/*Add 20 more sound samples*/}
                    {t("loadMore")}
                </button>
            </div>

        </div>
    </div>
    )
}