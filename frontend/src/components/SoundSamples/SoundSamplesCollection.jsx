import trashPNG from '../../assets/trashCan.png';
import { deleteSoundSample } from "../../services/soundSampleService.jsx";

export default function UplaodedSoundSamples({ soundSamples, witch, onDeleted, showenCard}) {
    let cardDesign = "card-secondary";; 
    let deleteBtn = "";
    // Choose the necessary card design
    if (witch === "users") {
        cardDesign = "card-primary";
        deleteBtn = <img src={trashPNG} alt="Delete sound sample"/>
    }

    // Delete a spesafic sound sample
    const deleteSS = async (soundSample) => {
        const resText = await deleteSoundSample(soundSample);
        console.log(resText);
        onDeleted();
    }

    // Show 20 more sound samples
    const loadMore = (SS) => {
        let amountToShow = 20;
        for (let i = 0; i < SS; i++) {
            if (SS.i.style === "invisible") {
                for (let j = i; j <= amountToShow; j++) {
                    SS.j.style = "visible";
                }
                break;
            }
        }
    }

    // Return sound sample cards
    return(
        <>
            {soundSamples.map((soundSample, i) =>  {
                let visibility = " block";
                if (showenCard - 1 < i) {
                    visibility = " hidden";
                }
                return <div className={cardDesign + visibility}>
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