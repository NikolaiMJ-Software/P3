import settingsPNG from "../assets/settings.png"
import {useParams, useNavigate} from "react-router-dom";
import { useTranslation } from "react-i18next";
import {useEffect, useState} from "react";
import {getFutureEvents, updateDate} from "../services/eventService.jsx";

export default function EventManager({ className }) {
    //get all the events
    const [currentEvents, setEvents] = useState([])
    const navigate = useNavigate();
    const {username} = useParams();
    const {t} = useTranslation();

    useEffect(() => {
        async function loadEvents() {
            const a = await getFutureEvents()
            setEvents(a)
            console.log(a)
        }
        loadEvents()
    }, []);

    return (
        <div className={className}>
            <div className={"text-center border p-2"}>
                <p>Event Manager</p>
            </div>
            <div className={"border border-t-0 flex flex-col p-3"}>
                <div className={"flex flex-row justify-evenly p-3 overflow-auto"}>
                    <EventButton label={t("start vote")} onClick={() => {navigate(`/admin/voting/${username}`)}}/>
                    <EventButton label={`${t("play")} ${t("sound sample")}`} onClick={()=> {navigate(`/admin/sound-sample/${username}`)}}/>
                    <EventButton label={`${t("wheel")}`} onClick={() => {navigate(`/admin/wheel/${username}`)}}/>
                </div>
                <div className={"flex flex-row justify-between"}>
                    <div className={"flex-grow-1 border overflow-auto max-h-70"}>
                        {currentEvents.map(ev => (
                            <Event id={ev.id} themeName={ev.name} date={ev.timestamp}/>
                        ))}
                    </div>
                    <div className={"m-2 w-1/5"}>
                        <EventButton label={`${t("create")} ${t("event")}`}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

function EventButton({ onClick, label }){
    return (
        <button className={"btn-primary"} onClick={onClick}>
            {label}
        </button>
    )
}

function Event ({ id, themeName, date }){
    const originalDate = date.split("T")[0]; // yyyy-mm-dd
    const [editing, setEditing] = useState(false);
    const [newDate, setNewDate] = useState(originalDate);

    async function changeDate() {
        try {
            console.log(`Updating date of event with id ${id} from ${originalDate} to ${newDate + " 16:45:00"}`)
            await updateDate(id, newDate+"T16:45:00")
            setEditing(false);

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className={"m-1 p-1.5 flex flex-row justify-between border rounded"}>
            <div className={"m-1 grow-1 text-center border"}>
                {themeName ?? "Startup Day"}
            </div>
            <div className="p-1 m-1 border w-40 text-center">
                {!editing ? (
                    originalDate.split("-").reverse().join("-")
                ) : (
                    <input
                        type="date"
                        className="border p-1"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        onBlur={changeDate}
                        autoFocus
                    />
                )}
            </div>
            <div className={"m-1 content-center"}>
                <img onClick={() => setEditing(!editing)} className={"h-6 w-6 cursor-pointer"} src={settingsPNG} alt={"settings"}/>
            </div>
        </div>
    )
}
