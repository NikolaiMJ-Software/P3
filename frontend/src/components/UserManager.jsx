import {adminUser, banUser, unadminUser, unbanUser} from "../services/adminService.jsx"
import {useParams} from "react-router-dom";
import {useState} from "react";

export default function UserManager(){
    const [tab, setTab] = useState("ban")


    return (
        <div className="p-5 flex flex-col mr-20 ml-20">
            <div className={"border border-b-0 text-center flex flex-row justify-between"}>
                <p onClick={() => setTab("ban")} className={`grow-1 cursor-pointer text-center p-3 border-r ${(tab === "ban") ? null : "border-b"}`}> Ban Manager </p>
                <p onClick={() => setTab("admin")} className={`grow-1 cursor-pointer text-center p-3 ${(tab === "admin") ? null : "border-b"}`}> Admin Manager</p>
            </div>
            {getComponent(tab)}
        </div>
    )
}

function BanManager() {
    const [user, setUser] = useState("")
    const [message, setMessage] = useState("")
    const {username} = useParams();

    return (
        <div className={"p-5 border border-t-0 flex flex-row justify-between content-center"}>
            <div className={"flex flex-col justify-center"}>
                <p>Brugernavn:</p>
                <input onChange={e => setUser(e.target.value)} className={"border"}/>
                <p className={"text-gray-400"}>{message}</p>
            </div>
            <div className={"flex flex-col "}>
                <ManagerButton onClick={() => setMessage(unbanUser([username, user]))} label={"Unban"}/>
                <ManagerButton onClick={() => setMessage(banUser([username, user]))} label={"Ban"}/>
            </div>
        </div>
    )
}

function AdminManager() {
    const [user, setUser] = useState("")
    const [message, setMessage] = useState("")
    return (
        <div className={"p-5 border border-t-0 flex flex-row justify-between content-center"}>
            <div className={"flex flex-col justify-center"}>
                <p>Username:</p>
                <input onChange={e => setUser(e.target.value)} className={"border"}/>
                <p className={"text-gray-400"}>{message}</p>
            </div>
            <div className={"flex flex-col "}>
                <ManagerButton onClick={() => setMessage(unadminUser(user))} label={"Unadmin"}/>
                <ManagerButton onClick={() => setMessage(adminUser(user))} label={"Admin"}/>
            </div>
        </div>
    )
}

function ManagerButton({ onClick, label}){
    return (<button
        onClick= {onClick}
        className={"border rounded m-1 pl-2 pr-2 hover:bg-gray-200 transition-colors cursor-pointer"}>
        {label}
    </button>)
}

function getComponent(comp){
    switch (comp){
        case 'ban':
            return <BanManager/>
        case 'admin':
            return <AdminManager/>
    }
}