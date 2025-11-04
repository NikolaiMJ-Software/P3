import {banUser, unbanUser} from "../services/adminService.jsx"
import {useParams} from "react-router-dom";
import {useState} from "react";

export default function UserManager(){
    const [user, setUser] = useState("")
    const [message, setMessage] = useState("")
    const {username} = useParams();

    return (
        <div className="p-5 flex flex-col mr-20 ml-20">
            <div className={"border text-center"}>
                User Manager
            </div>
            <div className={"p-5 border border-t-0 flex flex-row justify-between content-center"}>
                <div className={"flex flex-col justify-center"}>
                    <p>Username:</p>
                    <input onChange={e => setUser(e.target.value)} className={"border"}/>
                    <p className={"text-gray-400"}>{message}</p>
                </div>
                <div className={"flex flex-col "}>
                    <BanButton onClick={() => setMessage(unbanUser([username, user]))} label={"Unban"}/>
                    <BanButton onClick={() => setMessage(banUser([username, user]))} label={"Ban"}/>
                </div>

            </div>
        </div>
    )
}

function BanButton({ onClick, label}){
    return (<button
        onClick= {onClick}
        className={"border rounded m-1 pl-2 pr-2 hover:bg-gray-200 transition-colors cursor-pointer"}>
        {label}
    </button>)
}