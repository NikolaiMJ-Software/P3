import settingsPNG from "../assets/settings.png"
import {useParams, useNavigate} from "react-router-dom";

export default function EventManager() {
    //get all the events
    const navigate = useNavigate();
    const {username} = useParams();

    const currentEvents = [
        <Event eventName={"First Event"} date={"30/10"}/>
        ,<Event eventName={"Second Event"} date={"31/10"}/>
        ,<Event eventName={"Third Event"} date={"32/10"}/>
        ,<Event eventName={"Fourth Event"} date={"33/10"}/>
        ,<Event eventName={"Fifth Event"} date={"34/10"}/>
        ,<Event eventName={"Sixth Event"} date={"35/10"}/>
        ,<Event eventName={"Seventh Event"} date={"1/11"}/>
        ,<Event eventName={"Eight Event"} date={"2/11"}/>
    ]

    return (
        <div className={"grow-1 flex flex-col p-5 "}>
            <div className={"text-center border p-2"}>
                <p>Event Manager</p>
            </div>
            <div className={"border border-t-0 flex flex-col p-3"}>
                <div className={"flex flex-row justify-evenly p-3"}>
                    <EventButton label={"Start Theme Vote"}/>
                    <EventButton label={"Play Sound Sample"}/>
                    <EventButton label={"Wheel of Fortune"} onClick={() => {navigate(`/wheel/${username}`)}}/>
                </div>
                <div>
                    Event Calender
                    <div className={"flex flex-row justify-between"}>
                        <div className={"flex-grow-1 border overflow-auto max-h-60"}>
                            {currentEvents}
                        </div>
                        <div className={"m-2"}>
                            <EventButton label={"Create Event"}/>
                        </div>
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