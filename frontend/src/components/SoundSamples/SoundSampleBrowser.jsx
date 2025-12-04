import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import SoundSampleCard from "./SoundSampleCard.jsx"
import { getSoundSamples } from "../../services/soundSampleService.jsx";

export default function SoundSampleBrowser({onCreateSS}) {
    const {t} = useTranslation();
    const { username } = useParams();
    const [usersSS, setUsersSoundSample] = useState([]);
    const [soundSamples, setSoundSample] = useState([]);
    const [originSoundSamples, setOriginSoundSamples] = useState([]);
    const [sortUsersSSText, setSortUsersText] = useState("latest");
    const [sortAllSSText, setSortAllText] = useState("oldest");
    const [allVisibleCount, setAllVisibleCount] = useState(4);
    const [usersVisibleCount, setUsersVisibleCount] = useState(3);
    const [searchForUsername, setSearchForUsername] = useState("");
    const [noSSMessage, setNoSSMessage] = useState("");

    useEffect(() => {
        load();
    }, []);

    // Get all sound samples
    async function load(){
        try {
            const SS = await getSoundSamples();
            // Filter only login users sound samples
            const usersSoundSample = SS.filter(
                SS => SS.username.toLowerCase() === username.toLowerCase()
            );
            
            // Set sound samples
            setSortAllText(sortAllSSText);
            setSoundSample(sortAllSSText === "latest" ? SS : [...SS].reverse());
            setOriginSoundSamples([...SS].reverse());
            setSortUsersText(sortUsersSSText);
            setUsersSoundSample(sortUsersSSText === "latest" ? usersSoundSample : [...usersSoundSample].reverse());

        } catch (error) {
            console.error("Error getting sound samples:", error);
        }
    };
    
    // Reload page
    const handleDeleted = () => {
        load();
    };

    // Sort filter: with name, oldest to newest and vice versa
    const sortSS = (selected) => {
        try {
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

            } else if (selected === "searchForUsers") {
                if (!searchForUsername.trim()) {
                    setSoundSample(sortAllSSText === "latest" ? originSoundSamples : [...originSoundSamples].reverse());
                    setNoSSMessage("");
                } else {
                    const filterSS = originSoundSamples.filter(SS => SS.usersFullName.toLowerCase().includes(searchForUsername.trim().toLowerCase()));
                    if (!filterSS.length) {
                        setNoSSMessage(`"${searchForUsername}"`);
                        setSoundSample([]);
                    } else {
                        setSoundSample(sortAllSSText === "latest" ? filterSS : [...filterSS].reverse());
                        setNoSSMessage("");
                    }
                }
            }
        } catch (error) {
            console.error("Error sorting sound samples:", error);
        }
    }

    return (
    <div className={"p-1 sm:p-10"}>
        <div className={"bg-primary drop-shadow-xl w-full max-w-full h-fit border-2 border-text-primary rounded-3xl p-2 sm:p-6"}>

            {/* Users sound sample card container */}
            <div className="flex justify-between items-center m-4">
                <div className={"m-4 text-sm sm:text-base font-bold"}>{t("usersSS")}</div>
                <button className={"btn-primary" + (usersSS.length > 1 ? " visible" : " invisible")}
                    data-testid="revUsersSS"
                    type="button"
                    onClick={() => sortSS("usersSS")}>
                    {t(sortUsersSSText)}
                </button>
            </div>
            
            <div className="flex sm:flex-wrap gap-2 overflow-x-auto">
                <div onClick={onCreateSS} className="card-primary flex flex-col justify-center items-center cursor-pointer text-lg font-medium shadow-sm hover:shadow-md transition shrink-0 bg-primary text-lg font-medium shadow-sm hover:bg-light-green transition shrink-0">
                    <p className={"mb-2 text-sm sm:text-lg text-center"}>{t("submit")} {t("sound sample")}</p>
                    <div className={"bg-light-green flex justify-center items-center w-10 sm:w-16 h-10 sm:h-16 border-3 sm:border-5 border-btn-green rounded-full"}>
                        <span className="text-3xl sm:text-5xl font-bold text-btn-green mb-1.5 sm:mb-2.5">+</span>
                    </div>
                </div>
                <SoundSampleCard soundSamples={usersSS} witch="users" onDeleted={handleDeleted} showenCard={usersVisibleCount}/>
            </div>
            <div className="flex justify-center p-2">
                <button className={"btn-primary" + (usersVisibleCount < usersSS.length ? " block" : " hidden")}
                    data-testid="loadMoreUsersSS"
                    type="button"
                    onClick={() => setUsersVisibleCount(usersVisibleCount + 20)}> {/*Add 20 more sound samples*/}
                    {t("loadMore")}
                </button>
            </div>

            <div className={"border-1 m-2 sm:m-8"}></div>

            {/* All sound samples card container */}
            <div className="flex justify-between items-center m-2 sm:m-4">
                <div className={"m-4 text-sm sm:text-base font-bold"}>{t("uplSS")}</div>
                <div className="hidden sm:flex justify-center">
                    <input
                        className="bg-primary drop-shadow-lg border px-2 py-1 rounded-2xl w-40 sm:w-64"
                        type="text" 
                        placeholder={t("search for") + " " + t("user") + "..."}
                        onChange={(e) => setSearchForUsername(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), sortSS("searchForUsers"))}
                    />
                    <button className={"btn-primary ml-2"}
                        data-testid="search"
                        type="button"
                        onClick={() => sortSS("searchForUsers")}>
                        {t("search")}
                    </button>
                </div>
                <button className={"btn-primary" + (soundSamples.length > 1 ? " visibel" : " invisible")}
                    data-testid="revAllSS"
                    type="button"
                    onClick={() => sortSS("allSS")}>
                    {t(sortAllSSText)}
                </button>
            </div>
            <div className="w-full">
                <SoundSampleCard soundSamples={soundSamples} witch="" showenCard={allVisibleCount}/>
            </div>
            <div className="flex justify-center p-2">
                <button className={"btn-primary" + (allVisibleCount < soundSamples.length ? " block" : " hidden")}
                    data-testid="loadMoreAllSS"
                    type="button"
                    onClick={() => setAllVisibleCount(allVisibleCount + 20)}> {/*Add 20 more sound samples*/}
                    {t("loadMore")}
                </button>
            </div>
            {noSSMessage && (
                <div className="flex justify-center items-center text-text-secondary">
                    {t("noSSMessage") + noSSMessage}
                </div>
            )}
        </div>
    </div>
    )
}