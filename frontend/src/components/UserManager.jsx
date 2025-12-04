import {adminUser, banUser, unadminUser, unbanUser} from "../services/adminService.jsx"
import {useParams} from "react-router-dom";
import {useState} from "react";
import {useTranslation} from "react-i18next";

export default function UserManager({ className }){
    const [tab, setTab] = useState("ban")


    return (
        <div className={className}>
            <div className={"border border-b-0 text-center flex flex-row justify-between"}>
                <p onClick={() => setTab("ban")} className={`bg-primary grow-1 cursor-pointer text-center p-3 border-r ${(tab === "ban") ? null : "border-b"}`}> Ban Manager </p>
                <p onClick={() => setTab("admin")} className={`bg-primary grow-1 cursor-pointer text-center p-3 ${(tab === "admin") ? null : "border-b"}`}> Admin Manager</p>
            </div>
            {getComponent(tab)}
        </div>
    )
}

function BanManager() {
    const [user, setUser] = useState("")
    const [message, setMessage] = useState("")
    const {username} = useParams();
    const {t} = useTranslation();

    return (
        <div className={"bg-primary p-5 border border-t-0 flex flex-row justify-between content-center flex-1 overflow-auto"}>
            <div className={"flex flex-col justify-center"}>
                <p>{t("username")}:</p>
                <input onChange={e => setUser(e.target.value)} className={"border"}/>
                <p className={"text-text-secondary"}>{message}</p>
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
    const {username} = useParams();
    return (
        <div className={"bg-primary p-5 border border-t-0 flex flex-row justify-between content-center flex-1 overflow-auto"}>
            <div className={"flex flex-col justify-center"}>
                <p>Username:</p>
                <input onChange={e => setUser(e.target.value)} className={"border"}/>
                <p className={"text-text-secondary"}>{message}</p>
            </div>
            <div className={"flex flex-col "}>
                <ManagerButton onClick={() => setMessage(unadminUser(username, user.toLowerCase()))} label={"Unadmin"}/>
                <ManagerButton onClick={() => setMessage(adminUser(username, user.toLowerCase()))} label={"Admin"}/>
            </div>
        </div>
    )
}

function ManagerButton({ onClick, label}){
    return (<button
        onClick= {onClick}
        className={"border rounded m-1 pl-2 pr-2 hover:bg-btn-hover-secondary transition-colors cursor-pointer"}>
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