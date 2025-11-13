import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import UplaodedSoundSamples from "./SoundSamplesCollection.jsx"
import { addSoundSample, deleteSoundSample, getSoundSamples, getSoundsampleFile } from "../../services/soundSampleService.jsx";

export default function SoundSampleBrowser() {
    const {t} = useTranslation();
    const { username } = useParams();
    const [usersSS, setUsersSoundSample] = useState([]);
    let soundSamples = [];

    useEffect( async () => {
        console.log("her", soundSamples);
        soundSamples = await getSoundSamples();
        console.log("der", soundSamples);
        soundSamples.forEach(soundSample => {
            if (soundSample.username.toLowerCase() === username.toLowerCase()) {
                setUsersSoundSample(soundSample);
            }
        });
        console.log("ja", soundSamples);
        console.log("USERS: ", usersSS);
    }, []);

    return (
    <div className={"p-10"}>
        <div className={"w-full max-w-full h-fit border-2 border-text-primary rounded-3xl p-8"}>
            {/* Upcoming themes card container */}
            <p className={"m-4 font-bold"}>Uploaded soundsamples</p>
            <div className={"flex gap-5 p-4 overflow-x-auto"}>
                {/* individual cards */}
                <UplaodedSoundSamples soundSamples={soundSamples}/>
            </div>

            <div className={"border-1 m-8"}></div>

            <p className={"m-4 font-bold"}>Your sound samples</p>
            {/* Your themes card container */}
            <div className={"pt-4 pl-6 flex row-end-5 flex gap-5"}>
                {/* individual cards */}
                <div className={"flex gap-5 p-4 overflow-x-auto"}>
                    {/* individual cards */}
                    <div className={"w-60 h-80 border-2 border-text-primary" +
                        "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>Create theme</div>
                    <div className={"w-60 h-80 border-2 border-text-primary" +
                        "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>theme</div>
                    <div className={"w-60 h-80 border-2 border-text-primary" +
                        "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>theme</div>
                    <div className={"w-60 h-80 border-2 border-text-primary" +
                        "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>theme</div>
                    <div className={"w-60 h-80 border-2 border-text-primary" +
                        "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>theme</div>
                    <div className={"w-60 h-80 border-2 border-text-primary" +
                        "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>theme</div>
                    <div className={"w-60 h-80 border-2 border-text-primary" +
                        "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>theme</div>
                    <div className={"w-60 h-80 border-2 border-text-primary" +
                        "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>theme</div>
                </div>
            </div>
        </div>
    </div>
    )
}