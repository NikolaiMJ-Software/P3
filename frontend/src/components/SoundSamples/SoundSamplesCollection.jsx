export default function UplaodedSoundSamples(soundsamples) {
    const safeSS = Array.isArray(soundsamples) ? soundsamples : [];
    
    // Return sound sample cards
    return(
        <div className={"w-60 h-80 border-2 border-text-primary" +
            "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>
                
            {safeSS.map(soundSample =>  {
                console.log(`Sound sample username: ${soundSample.username}`)
                return <div>
                    <h2 className={"text-sm text-text-secondary"}>{soundSample.username}</h2>
                    <p>{soundSample.soundSample}</p>
                </div>
            })}

        </div>
    )
}