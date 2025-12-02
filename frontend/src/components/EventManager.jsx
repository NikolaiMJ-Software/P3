import settingsPNG from "../assets/settings.png"
import {useParams, useNavigate} from "react-router-dom";
import { useTranslation } from "react-i18next";
import {useEffect, useState} from "react";
import {getFutureEvents, updateDate, uploadEvent} from "../services/eventService.jsx";
import CreateEvent from "./CreateEvent.jsx";

export default function EventManager({ className }) {
    //get all the events
    const [currentEvents, setEvents] = useState([])
    const navigate = useNavigate();
    const {username} = useParams();
    const {t} = useTranslation();
    const [createEvent, setCreateEvent] = useState(false);
    const [eventType, setEventType] = useState(false)

    async function loadEvents() {
        const a = await getFutureEvents()
        setEvents(a)
        console.log(a)
    }
    useEffect(() => {
        loadEvents()
    }, []);

    function stopEventCreate(){
        setEventType(false)
        setCreateEvent(false)
        loadEvents()
    }

    async function createNewEvent(id) {
        let timestamp = prompt("Set date of event in yyyy-mm-dd format")
        if (!timestamp || !/^\d{4}-\d{2}-\d{2}$/.test(timestamp)){
            alert("Please enter a valid date in yyyy-mm-dd format.")
            return
        }
        const date = !id ? new Date(`${timestamp}T15:00:00`) : new Date(`${timestamp}T15:45:00`)
        if (!date.toJSON()){
            alert("Invalid date. Please enter a valid date")
            return
        }
        const pad = (num) => String(num).padStart(2, "0");

        const formattedDate =
            `${date.getFullYear()}-` +
            `${pad(date.getMonth() + 1)}-` +
            `${pad(date.getDate())}T` +
            `${pad(date.getHours())}:` +
            `${pad(date.getMinutes())}:` +
            `00`;
        uploadEvent(formattedDate, id).then(stopEventCreate)
    }

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
                            <Event id={ev.id} themeName={ev.name} date={ev.timestamp} loadEvents={loadEvents}/>
                        ))}
                    </div>
                    <div className={"m-2 w-1/5"}>
                        <EventButton label={`${t("create")} ${t("event")}`} onClick={()=> setCreateEvent(true)}/>
                    </div>
                </div>
            </div>
                {createEvent && ((!eventType && (
                        <div className="fixed inset-0 z-50 bg-black/40 flex justify-center overflow-y-auto py-10">
                            {/* Main container */}
                            <div className={"w-[400px] mt-[200px] max-w-full h-[300px] border-2 border-text-primary rounded-3xl p-8 bg-white flex flex-col gap-3"}>
                                {/* Title + x */}
                                <div className={"flex justify-between"}>
                                    <p> Choose Event Type </p>
                                    <p className={"text-xl hover:cursor-pointer"} onClick={stopEventCreate}>x</p>
                                </div>
                                {/* Event type */}
                                <div className={"flex justify-evenly h-full"}>
                                    {/* Startup day */}
                                    <button className={"w-[50%] border rounded hover:cursor-pointer hover:bg-gray-300"} onClick={() => createNewEvent(null)}>
                                        F-Klub Startup Day
                                    </button>
                                    {/* Normal event */}
                                    <button className={"w-[50%] border-l-0 border rounded hover:cursor-pointer hover:bg-gray-300"} onClick={() => setEventType(true)}>
                                        Regular Event
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) ||
                    (eventType && (<CreateEvent onClose={stopEventCreate} onCreate={createNewEvent} />)))
                }
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

function Event ({ id, themeName, date, loadEvents }){
    const originalDate = date.split("T")[0]; // yyyy-mm-dd
    const [editing, setEditing] = useState(false);
    const [newDate, setNewDate] = useState(originalDate);

    async function changeDate() {
        try {
            if (newDate === originalDate){
                setEditing(false);
                return
            }
            console.log(`Updating date of event with id ${id} from ${originalDate} to ${newDate + " 16:45:00"}`)
            await updateDate(id, newDate+"T16:45:00")
            setEditing(false);
            loadEvents()
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
