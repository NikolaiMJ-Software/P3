import React from "react";
import trashPNG from '../../assets/trashCan.png';
import { deleteSoundSample } from "../../services/soundSampleService.jsx";

export default function SoundSampleCard({ soundSamples, witch, onDeleted, showenCard}) {
    // Choose the necessary card design
    const cardDesign = witch === "users" ? "card-primary" : "card-secondary";
    const SSid = witch === "users" ? "usersSS" : "allSS";

    // Delete a spesafic sound sample
    const deleteSS = async (soundSample) => {
        const resText = await deleteSoundSample(soundSample);
        console.log(resText);
        onDeleted();
    }

    // Return sound sample cards
    return(
        <>
            {soundSamples.map((soundSample, i) =>  {
                const visibility = (showenCard - 1 < i) ? " hidden" : " block";
                const deleteBtn = witch === "users" ? <img src={trashPNG} alt={`Delete sound sample: ${soundSample.soundSample}`}/> : "";

                return <div className={cardDesign + visibility} data-testid={`${SSid}-${soundSample.soundSample}`}>
                    <div className={"flex flex-col"}>
                        <div className="flex justify-between items-center m-4">
                            <h2 className={"text-sm text-text-secondary"}>{soundSample.usersFullName}</h2>
                            <div className="w-5 h-5 cursor-pointer hover:bg-btn-hover-secondary" onClick={() => deleteSS(soundSample.soundSample)}>{deleteBtn}</div>
                        </div>
                        <div className="overflow-x-auto">{soundSample.soundSample}</div>
                    </div>
                </div>
            })}
        </>
    )
}