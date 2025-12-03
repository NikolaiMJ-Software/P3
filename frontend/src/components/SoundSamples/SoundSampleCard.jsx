import React, { useState } from "react";
import trashPNG from '../../assets/trashCan.png';
import downArrowPNG from '../../assets/down-arrow.png';
import rightArrowPNG from '../../assets/left-arrow.png';
import { deleteSoundSample } from "../../services/soundSampleService.jsx";
import MediaPlayer from "./MediaPlayer.jsx";
import { useTranslation } from "react-i18next";

export default function SoundSampleCard({ soundSamples, witch, onDeleted, showenCard}) {
    const [allSSMediaPlayer, setallSSMediaPlayer] = useState({});
    const [arrowPNG, setArrowPNG] = useState({});
    const { t } = useTranslation();
    
    // Choose the necessary card design
    const cardDesign = witch === "users" ? "card-primary" : "card-secondary";
    const SSid = witch === "users" ? "usersSS" : "allSS";
    const pointer = witch === "users" ? "" : " cursor-pointer";

    // Delete a spesafic sound sample
    const deleteSS = async (soundSample, id) => {
        const youSureQuestionmark = window.confirm(t("youSure"));
        if (!youSureQuestionmark) return;
        const resText = await deleteSoundSample(soundSample, id);
        console.log(resText);
        onDeleted();
    }

    // Creating individual toggle to a card
    const onToggel = (id) => {
        setArrowPNG(arr => ({
            ...arr,
            [id]: arr[id] === downArrowPNG ? rightArrowPNG : downArrowPNG
        }));

        setallSSMediaPlayer(arr => ({
            ...arr,
            [id]: arr[id] === "flex justify-center" ? "h-15 overflow-hidden flex justify-center" : "flex justify-center"
        }));
    }

    // Return sound sample cards
    return(
        <>
            {soundSamples.map((soundSample, i) =>  {
                const visibility = (showenCard - 1 < i) ? " hidden" : " block";
                const eventBtn = witch === "users" ? <img src={trashPNG} alt={`Delete sound sample: ${soundSample.soundSample}`}/> : <img src={(arrowPNG[soundSample.id] || rightArrowPNG)} alt={`Drobdown sound sample: ${soundSample.soundSample}`}/>;

                return <div key={soundSample.id} className={cardDesign + visibility} data-testid={`${SSid}-${soundSample.soundSample}`}>
                    <div className={"flex flex-col" + pointer} onClick={() => onToggel(soundSample.id)}>
                        <div className="flex justify-between items-center m-4">
                            <h2 className={"text-xs sm:text-sm text-text-secondary"}>{soundSample.usersFullName}</h2>
                            <div className="w-4 sm:w-5 h-4 sm:h-5 cursor-pointer hover:bg-btn-hover-secondary" onClick={witch === "users" ? () => deleteSS(soundSample.soundSample, soundSample.id) : ""}>
                                {eventBtn}
                            </div>
                        </div>
                        <div className={witch === "users" ? "h-32 overflow-y-auto" : (allSSMediaPlayer[soundSample.id] || "h-15 overflow-hidden flex justify-center")}>
                            <MediaPlayer soundSample={soundSample.soundSample}/>
                        </div>
                    </div>
                </div>
            })}
        </>
    )
}