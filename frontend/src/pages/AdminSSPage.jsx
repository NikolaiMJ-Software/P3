import {useParams} from "react-router-dom";
import {isAdmin} from "../services/adminService.jsx"
import {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import Timer from "../components/Timer.jsx";
import { addSoundSample, deleteSoundSample, getSoundSamples, getSoundsampleFile } from "../services/soundSampleService.jsx";
import { useNavigate } from "react-router-dom";
import MediaPlayer from "../components/SoundSamples/MediaPlayer.jsx";


export default function AdminSSPage(){
    const {username} = useParams();
    const [isAdminUser, setIsAdminUser] = useState(undefined);
    const [resetKey, setResetKey] = useState(0);
    const {t} = useTranslation();
    const [soundSamples, setSoundSamples] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();


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

    //checks if there are more soundsamples then 0
    const hasSamples = soundSamples.length > 0;

    //chooses the current soundsample if there is a soundsample
    const currentSample = hasSamples ? soundSamples[currentIndex] : null;

    //navigation function that takes care of the next and previous button, and the buffer delete
    const handleNavigate = async (direction) => {
        if (!hasSamples) return;

        //defines the deletion index
        const deleteIndex = currentIndex - 3;

        //makes a list to update the soundsamples
        let updated = soundSamples;

        //if statement to ensure deleteindex is not less then 0 or higher then list length
        if (deleteIndex >= 0 && deleteIndex < soundSamples.length) {
            //defines sound sample to delete
            const sampleToDelete = soundSamples[deleteIndex];

            //deletes sample
            await deleteSoundSample(sampleToDelete.soundSample);

            //sorts out deleted indexes from the updated list
            updated = soundSamples.filter((_, i) => i !== deleteIndex);

            //sets sound samples to the updated list
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

    //functions to go back and forward using handlenavigate
    const handleNext = () => handleNavigate(1);
    const handlePrevious = () => handleNavigate(-1);

    //function that makes the stop time delete the rest of the buffer samples
    const handleTimerStop = async () => {
        if (!hasSamples || currentIndex === 0) return;

        const bufferToDelete = soundSamples.slice(0, currentIndex);

        for (const sample of bufferToDelete) {
            await deleteSoundSample(sample.soundSample);  
        }


        const updated = soundSamples.slice(currentIndex);

        setSoundSamples(updated);
        setCurrentIndex(0); 
    };





    if(isAdminUser === 1){
        return (
            <div className="p-6">
                {/* Timer */}
                <div className="flex justify-end mb-6">
                    <Timer initialSeconds={1800} resetKey={resetKey} onStop={handleTimerStop}/>
                </div>

                {/* Media Player */}
                <div className="flex flex-col items-center gap-4">

                    {/* User full name */}
                    <div className="text-lg font-semibold flex flex-col items-start">
                        {hasSamples ? currentSample.usersFullName : "No Sound Samples Available"}
                    </div>
                    
                    {/* Mediaplayer Placeholder */}
                    <div className="h-69">
                        { hasSamples && <MediaPlayer soundSample={currentSample.soundSample}/>}
                    </div>
                    {/* Next and Back buttons */}
                    <div className="flex gap-85 mt-2">
                        <button
                            onClick={handlePrevious}
                            disabled={!hasSamples || currentIndex === 0}
                            className="btn-primary w-32 text-center disabled:opacity-40"
                        >
                            ← {t("prev")}
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!hasSamples || currentIndex === soundSamples.length - 1}
                            className="btn-primary w-32 text-center disabled:opacity-40"
                        >
                            {t("next")} →
                        </button>
                    </div>
                </div>
            </div>

        )
    }else if (isAdminUser === 0) {
        navigate(`/${username}`);
    }
}
