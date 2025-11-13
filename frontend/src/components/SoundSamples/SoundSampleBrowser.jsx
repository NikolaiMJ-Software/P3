import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import UplaodedSoundSamples from "./SoundSamplesCollection.jsx"
import { addSoundSample, deleteSoundSample, getSoundSamples, getSoundsampleFile } from "../../services/soundSampleService.jsx";

export default function SoundSampleBrowser() {
    const {t} = useTranslation();
    const { username } = useParams();
    const [usersSS, setUsersSoundSample] = useState([]);
    const [soundSamples, setSoundSample] = useState([]);

    useEffect(() => {
        async function load(){
            const SS = await getSoundSamples();
            setSoundSample(SS);
            // Filter only users
            const usersSoundSample = SS.filter(
                SS => SS.username.toLowerCase() === username.toLowerCase()
            );

            setUsersSoundSample(usersSoundSample);
            console.log("All SS: ", SS);
            console.log("Users SS: ", usersSoundSample);
        };
        
        load();
    }, [username]);

    return (
    <div className={"p-10"}>
        <div className={"w-full max-w-full h-fit border-2 border-text-primary rounded-3xl p-8"}>

            {/* Users sound sample card container */}
            <p className={"m-4 font-bold"}>Your sound samples</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                <UplaodedSoundSamples soundSamples={usersSS}/>
            </div>

            <div className={"border-1 m-8"}></div>

            {/* Upcoming themes card container */}
            <p className={"m-4 font-bold"}>Uploaded soundsamples</p>
            <div className="w-full max-w-full h-fit">
                <UplaodedSoundSamples soundSamples={soundSamples}/>
            </div>

        </div>
    </div>
    )
}