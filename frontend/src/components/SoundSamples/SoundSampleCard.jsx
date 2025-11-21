import React, { useState } from "react";
import trashPNG from '../../assets/trashCan.png';
import { deleteSoundSample } from "../../services/soundSampleService.jsx";
import MediaPlayer from "./MediaPlayer.jsx";

export default function SoundSampleCard({ soundSamples, witch, onDeleted, showenCard}) {
    const [allSSMediaPlayer, setallSSMediaPlayer] = useState({});
    // Choose the necessary card design
    const cardDesign = witch === "users" ? "card-primary" : "card-secondary";
    const SSid = witch === "users" ? "usersSS" : "allSS";
    const pointer = witch === "users" ? "" : " cursor-pointer";

    // Delete a spesafic sound sample
    const deleteSS = async (soundSample) => {
        const resText = await deleteSoundSample(soundSample);
        console.log(resText);
        onDeleted();
    }

    // Creating individual toggle to a card
    const onToggel = (SSName) => {
        const mediaDesign = SSName.includes("tiktok.com") ? " " : "aspect-video";
        setallSSMediaPlayer(arr => ({
            ...arr,
            [SSName]: arr[SSName] === mediaDesign ? "h-15" : mediaDesign
        }));
    }

    // Return sound sample cards
    return(
        <>
            {soundSamples.map((soundSample, i) =>  {
                const visibility = (showenCard - 1 < i) ? " hidden" : " block";
                const deleteBtn = witch === "users" ? <img src={trashPNG} alt={`Delete sound sample: ${soundSample.soundSample}`}/> : "";

                return <div className={cardDesign + visibility} data-testid={`${SSid}-${soundSample.soundSample}`}>
                    <div className={"flex flex-col" + pointer} onClick={() => onToggel(soundSample.soundSample)}>
                        <div className="flex justify-between items-center m-4">
                            <h2 className={"text-sm text-text-secondary"}>{soundSample.usersFullName}</h2>
                            {witch === "users" && (
                                <div className="w-5 h-5 cursor-pointer hover:bg-btn-hover-secondary" onClick={() => deleteSS(soundSample.soundSample)}>
                                    {deleteBtn}
                                </div>
                            )}
                        </div>
                        <MediaPlayer soundSample={soundSample.soundSample} size={witch === "users" ? "aspect-video" : (allSSMediaPlayer[soundSample.soundSample] || "h-15")}/>
                    </div>
                </div>
            })}
        </>
    )
}