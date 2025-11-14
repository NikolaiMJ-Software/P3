import trashPNG from '../../assets/trashCan.png';
import SoundSampleBrowser from "./SoundSampleBrowser.jsx"
import { deleteSoundSample } from "../../services/soundSampleService.jsx";

export default function UplaodedSoundSamples({ soundSamples, witch, onDeleted}) {
    let design; 
    let deleteBtn;
    if (witch === "users") {
        design = "card-primary";
        deleteBtn = <img src={trashPNG} alt="Delete sound sample"/>
    } else {
        design = "card-secondary";
        deleteBtn = "";
    }

    const deleteSS = async (soundSample) => {
        const resText = await deleteSoundSample(soundSample);
        console.log(resText);
        onDeleted();
    }

    // Return sound sample cards
    return(
        <>
            {soundSamples.map(soundSample =>  {
               return <div className={design}>
                    <div className={"flex flex-col "}>
                        <div className="flex justify-between items-center m-4">
                            <h2 className={"text-sm text-text-secondary"}>{soundSample.username}</h2>
                            <div className="w-5 h-5 cursor-pointer hover:bg-btn-hover-secondary" onClick={() => deleteSS(soundSample.soundSample)}>{deleteBtn}</div>
                        </div>
                        <div className="overflow-x-auto">{soundSample.soundSample}</div>
                    </div>
                </div>
            })}
        </>
    )
}