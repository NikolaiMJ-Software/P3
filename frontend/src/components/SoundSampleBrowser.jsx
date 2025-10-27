
export default function SoundSampleBrowser() {

    return (
    <div className={"m-10"}>
        <div className={"w-300 h-fit border-2 border-black rounded-3xl p-8"}>
            {/* Upcoming themes card container */}
            <p className={"m-4 font-bold"}>Your sound samples</p>
            <div className={"flex gap-5 p-4 overflow-x-auto"}>
                {/* individual cards */}
                <div className={"w-60 h-80 border-2 border-black" +
                    "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>Submit sound sample</div>
                <div className={"w-60 h-80 border-2 border-black" +
                    "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>theme</div>
            </div>
            <div className={"border-1 m-8"}></div>
            <p className={"m-4 font-bold"}>Your themes</p>
            {/* Your themes card container */}
            <div className={"pt-4 pl-6 flex row-end-5 flex gap-5"}>
                {/* individual cards */}
                <div className={"flex gap-5 p-4 overflow-x-auto"}>
                    {/* individual cards */}
                    <div className={"w-60 h-80 border-2 border-black" +
                        "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>Create theme</div>
                    <div className={"w-60 h-80 border-2 border-black" +
                        "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>theme</div>
                    <div className={"w-60 h-80 border-2 border-black" +
                        "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>theme</div>
                    <div className={"w-60 h-80 border-2 border-black" +
                        "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>theme</div>
                    <div className={"w-60 h-80 border-2 border-black" +
                        "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>theme</div>
                    <div className={"w-60 h-80 border-2 border-black" +
                        "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>theme</div>
                    <div className={"w-60 h-80 border-2 border-black" +
                        "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>theme</div>
                    <div className={"w-60 h-80 border-2 border-black" +
                        "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>theme</div>
                </div>
            </div>
        </div>
    </div>
    )
}