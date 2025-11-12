export default function SoundSampleCard() {

    return (
        <div>
            <div className={"w-400 h-200 border-2 border-text-primary rounded-4xl"}>
                <p>Your sound samples</p>
                {/* card container */}
                <div className={"pt-4 pl-6 flex row-end-5 flex gap-5"}>
                    {/* individual cards */}
                    <div className={"w-60 h-80 border-2 border-text-primary" +
                        "text-lg font-medium shadow-sm hover:shadow-md transition"}>Submit sound sample</div>
                    <div className={"w-60 h-80 border-2 border-text-primary" +
                        "text-lg font-medium shadow-sm hover:shadow-md transition"}>Submit sound sample</div>
                    <div className={"w-60 h-80 border-2 border-text-primary" +
                        "text-lg font-medium shadow-sm hover:shadow-md transition"}>Submit sound sample</div>
                    <div className={"w-60 h-80 border-2 border-text-primary" +
                        "text-lg font-medium shadow-sm hover:shadow-md transition"}>Submit sound sample</div>
                </div>
            </div>
        </div>
    )}