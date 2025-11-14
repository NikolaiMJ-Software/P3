export default function UplaodedSoundSamples({ soundSamples }) {

    // Return sound sample cards
    return(
        <>
            {soundSamples.map(soundSample =>  {
               return <div className={"w-60 h-80 border-2 border-text-primary" + "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>
                    <div className={"flex gap-5 p-4 overflow-x-auto"}>
                        <h2 className={"text-sm text-text-secondary"}>{soundSample.username}</h2>
                        <p>{soundSample.soundSample}</p>
                    </div>
                </div>
            })}
        </>
    )
}