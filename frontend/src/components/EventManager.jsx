import settingsPNG from "../assets/settings.png"
import {useParams, useNavigate} from "react-router-dom";
import { useTranslation } from "react-i18next";
import {useEffect, useState} from "react";
import {getFutureEvents, updateDate, uploadEvent} from "../services/eventService.jsx";
import CreateEvent from "./CreateEvent.jsx";

export default function EventManager({ className }) {
    // Consts
    const [currentEvents, setEvents] = useState([])
    const navigate = useNavigate();
    const {username} = useParams();
    const {t} = useTranslation();
    const [createEvent, setCreateEvent] = useState(false);
    const [eventType, setEventType] = useState(false)

    // Function to load events
    async function loadEvents() {
        const a = await getFutureEvents()
        setEvents(a)
        console.log(a)
    }

    // Load the events when the component renders
    useEffect(() => {
        loadEvents()
    }, []);

    // Function to cancel event creation
    function stopEventCreate(){
        setEventType(false)
        setCreateEvent(false)
        loadEvents()
    }

    // Function to create a new event
    async function createNewEvent(id) {
        // Get the date through a prompt
        let timestamp = prompt("Set date of event in yyyy-mm-dd format")
        //Check if the date is valid
        if (!timestamp || !/^\d{4}-\d{2}-\d{2}$/.test(timestamp)){
            alert("Please enter a valid date in yyyy-mm-dd format.")
            return
        }
        // Check if an id was given (Startup day or actual theme) then convert to Date object for validation (fx 42-13-2025 is not valid)
        const date = !id ? new Date(`${timestamp}T15:00:00`) : new Date(`${timestamp}T15:45:00`)
        if (!date.toJSON()){ // Converting a Date to JSON will give an error if not convertable/valid
            alert("Invalid date. Please enter a valid date")
            return
        }
        // Formatting the date so the backend can read it
        const pad = (num) => String(num).padStart(2, "0");
        const formattedDate =
            `${date.getFullYear()}-` +
            `${pad(date.getMonth() + 1)}-` +
            `${pad(date.getDate())}T` +
            `${pad(date.getHours())}:` +
            `${pad(date.getMinutes())}:` +
            `00`;

        // Upload the event to the database
        uploadEvent(formattedDate, id).then(stopEventCreate)
    }

    return (
        <div className={className}>
            <div className={"bg-primary text-center border p-2"}>
                <p>Event Manager</p>
            </div>
            <div className={"bg-primary border border-t-0 flex flex-col p-3"}>
                {/* Buttons for alternative pages */}
                <div className={"flex flex-row justify-evenly p-3 overflow-auto"}>
                    <EventButton label={t("start vote")} onClick={() => {navigate(`/admin/voting/${username}`)}}/>
                    <EventButton label={`${t("play")} ${t("sound sample")}`} onClick={()=> {navigate(`/admin/sound-sample/${username}`)}}/>
                    <EventButton label={`${t("wheel")}`} onClick={() => {navigate(`/admin/wheel/${username}`)}}/>
                </div>
                <div className={"flex flex-row justify-between"}>
                    {/* Events */}
                    <div className={"bg-primary flex-grow-1 border overflow-auto max-h-70"}>
                        {currentEvents.map(ev => (
                            <Event id={ev.id} themeName={ev.name} date={ev.timestamp} loadEvents={loadEvents}/>
                        ))}
                    </div>
                    {/* Create event button */}
                    <div className={"m-2 w-1/5"}>
                        <EventButton label={`${t("create")} ${t("event")}`} onClick={()=> setCreateEvent(true)}/>
                    </div>
                </div>
            </div>

                {createEvent && ((!eventType && (
                        // Popup for event type to create
                        <div className="fixed inset-0 z-50 bg-black/40 flex justify-center overflow-y-auto py-10">
                            {/* Main container */}
                            <div className={"w-[400px] mt-[200px] max-w-full h-[300px] border-2 border-text-primary rounded-3xl p-8 bg-primary flex flex-col gap-3"}>
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
                    // If normal event, show <CreateEvent>
                    (eventType && (<CreateEvent onClose={stopEventCreate} onCreate={createNewEvent} />)))
                }
        </div>
    )
}

// Standardized buttons for the component
function EventButton({ onClick, label }){
    return (
        <button className={"btn-primary"} onClick={onClick}>
            {label}
        </button>
    )
}

function Event ({ id, themeName, date, loadEvents }){
    // Consts
    const originalDate = date.split("T")[0]; // yyyy-mm-dd
    const [editing, setEditing] = useState(false);
    const [newDate, setNewDate] = useState(originalDate);

    // Function to change the date of an event
    async function changeDate() {
        try {
            if (newDate === originalDate){ // If the date wasn't changed, end early (no unnecessary backend calls)
                setEditing(false);
                return
            }

            // Update the date in the backand
            await updateDate(id, newDate+"T16:45:00")
            setEditing(false);
            loadEvents()
        } catch (err) {
            console.error(err);
        }
    }

    // Render the event
    return (
        <div className={"bg-primary m-1 p-1.5 flex flex-row justify-between border rounded"}>
            <div className={"m-1 grow-1 text-center border"}>
                {/* If the event has no themename, se it to Startup Day*/}
                {themeName ?? "Startup Day"}
            </div>
            <div className="p-1 m-1 border w-40 text-center">
                {/* Date */}
                {!editing ? (
                    // Make the given date readable for a user (dd-mm-yyyy instead of yyyy-mm-dd)
                    originalDate.split("-").reverse().join("-")
                ) : ( // Calendar for editing the date
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
            {/* Cogwheel for editing the date */}
            <div className={"m-1 content-center"}>
                <img onClick={() => setEditing(!editing)} className={"h-6 w-6 cursor-pointer"} src={settingsPNG} alt={"settings"}/>
            </div>
        </div>
    )
}
