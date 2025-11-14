import {useParams} from "react-router-dom";
import {adminUser, isAdmin, unadminUser} from "../services/adminService.jsx"
import {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import Timer from "../components/Timer.jsx";
import { addSoundSample, deleteSoundSample, getSoundSamples, getSoundsampleFile } from "../services/soundSampleService.jsx";


export default function AdminSSPage(){
    const {username} = useParams();
    const [isAdminUser, setIsAdminUser] = useState(undefined);
    const [resetKey, setResetKey] = useState(0);
    const {t} = useTranslation();
    const [soundSamples, setSoundSamples] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);


    //check if {username} is admin
    useEffect(() => {
    async function load() {
        const result = await isAdmin(username);
        setIsAdminUser(result);

        const samples = await getSoundSamples(false, true);
        console.log(samples);
        setSoundSamples(samples);
        setCurrentIndex(0);
    }

    load();
    }, [username]);


    console.log(isAdminUser)

    const hasSamples = soundSamples.length > 0;
    const currentSample = hasSamples ? soundSamples[currentIndex] : null;

    const handleNavigate = async (direction) => {
        if (!hasSamples) return;

        const deleteIndex = currentIndex - 3;

        let updated = soundSamples;

        if (deleteIndex >= 0 && deleteIndex < soundSamples.length) {
            const sampleToDelete = soundSamples[deleteIndex];

            await deleteSoundSample(sampleToDelete.soundSample);

            updated = soundSamples.filter((_, i) => i !== deleteIndex);
            setSoundSamples(updated);
        }

        if (updated.length === 0) {
            setCurrentIndex(0);
            return;
        }

        let baseIndex = currentIndex;
        if (deleteIndex >= 0 && deleteIndex < currentIndex) {
            baseIndex = currentIndex - 1;
        }

        let nextIndex = baseIndex + direction;

        if (nextIndex < 0) nextIndex = 0;
        if (nextIndex >= updated.length) nextIndex = updated.length - 1;

        setCurrentIndex(nextIndex);
    };

    const handleNext = () => handleNavigate(1);
    const handlePrevious = () => handleNavigate(-1);



    if(isAdminUser === 1){
        return (
            <div className="p-6">
                {/* Timer */}
                <div className="flex justify-end mb-6">
                    <Timer initialSeconds={1800} resetKey={resetKey}/>
                </div>

                {/* Media Player */}
                <div className="flex flex-col items-center gap-4">

                    {/* User full name */}
                    <div className="text-lg font-semibold flex flex-col items-start">
                        {hasSamples ? currentSample.usersFullName : "No Sound Samples Available"}
                    </div>
                    
                    {/* Mediaplayer Placeholder */}
                    <div className="w-full max-w-xl h-40 border border rounded-md flex items-center justify-center">
                        {hasSamples ? (
                            <span className="text-sm text-center px-4">
                                Placeholder for media player
                                <br/>
                                <code className="break-all">{currentSample.soundSample}</code>
                            </span>
                        ) : (
                            <span className="text-sm text-gray-500">
                                Waiting for sound samples...
                            </span>
                        )}
                    </div>

                    {/* Next and Back buttons */}
                    <div className="flex gap-85 mt-2">
                        <button
                            onClick={handlePrevious}
                            disabled={!hasSamples || currentIndex === 0}
                            className="btn-primary w-32 text-center disabled:opacity-40"
                        >
                            ← Previous
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!hasSamples || currentIndex === soundSamples.length - 1}
                            className="btn-primary w-32 text-center disabled:opacity-40"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </div>

        )
    }
}
