import settingsPNG from "../assets/settings.png"
import {useParams, useNavigate} from "react-router-dom";

export default function EventManager() {
    //get all the events
    const navigate = useNavigate();
    const {username} = useParams();

    const currentEvents = [
        <Event eventName={"Første Begivenhed"} date={"30/10"}/>
        ,<Event eventName={"Anden Begivenhed"} date={"31/10"}/>
        ,<Event eventName={"Tredje Begivenhed"} date={"32/10"}/>
        ,<Event eventName={"Fjerde Begivenhed"} date={"33/10"}/>
        ,<Event eventName={"Femte Begivenhed"} date={"34/10"}/>
        ,<Event eventName={"Sjette Begivenhed"} date={"35/10"}/>
        ,<Event eventName={"Syvende Begivenhed"} date={"1/11"}/>
        ,<Event eventName={"Ottene Begivenhed"} date={"2/11"}/>
    ]

    return (
        <div className={"grow-1 flex flex-col p-5 "}>
            <div className={"text-center border p-2"}>
                <p>Event Manager</p>
            </div>
            <div className={"border border-t-0 flex flex-col p-3"}>
                <div className={"flex flex-row justify-evenly p-3"}>
                    <EventButton label={"Start Votering"}/>
                    <EventButton label={"Afspil lydprøveforslag"}/>
                    <EventButton label={"Lykkehjul"} onClick={() => {navigate(`/wheel/${username}`)}}/>
                </div>
                <div className={"flex flex-row justify-between"}>
                    <div className={"flex-grow-1 border overflow-auto max-h-70"}>
                        {currentEvents}
                    </div>
                    <div className={"m-2"}>
                        <EventButton label={"Skab Begivenhed"}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

function EventButton({ onClick, label }){
    return (
        <button className={"m-1 p-2 border rounded-2xl hover:bg-gray-300 transition-colors cursor-pointer"} onClick={onClick}>
            {label}
        </button>
    )
}

function Event ({ eventName, date }){
    return (
        <div className={"m-1 p-1.5 flex flex-row justify-between border rounded"}>
            <div className={"m-1 grow-1 text-center border"}>
                {eventName}
            </div>
            <div className={"p-1 m-1 border w-17 text-center"}>
                {date}
            </div>
            <div className={"m-1 content-center"}>
                <img onClick={() => console.log("hi")} className={"h-6 w-6 cursor-pointer"} src={settingsPNG} alt={"settings"}/>
            </div>
        </div>
    )
}