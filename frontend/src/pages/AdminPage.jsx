import {useParams} from "react-router-dom";
import {adminUser, isAdmin, unadminUser} from "../services/adminService.jsx"
import {useEffect, useState} from "react";
import UserManager from "../components/UserManager.jsx";
import EventManager from "../components/EventManager.jsx";
import SubmissionManager from "../components/SubmissionManager.jsx";
import { useTranslation } from "react-i18next";


export default function AdminPage(){
    const {username} = useParams();
    const [isAdminUser, setIsAdminUser] = useState(undefined);
    const {t} = useTranslation();

    //check if {username} is admin
    useEffect(() => {
        async function checkAdmin() {
            const result = await isAdmin(username);
            setIsAdminUser(result);
        }
        checkAdmin();
    }, [username]);

    console.log(isAdminUser)

    if(isAdminUser === 1){
        return (
            <div>
                <p>Hello {username}</p>
                <AdminButton
                    func={unadminUser}
                    username={username}
                    label={`Unbecome Admin`}
                />
                <div className="flex flex-col">
                    {/* Top Half */}
                    <div className="flex flex-row justify-between w-full">
                        {/* Event Manager */}
                        <EventManager className={"flex flex-col p-5 w-1/2"}/>
                        {/* Upper Right */}
                        <div className="flex flex-col justify-between w-1/2">
                            {/* Intro Text */}
                            <div className="mt-20 text-center text-xl">
                                <h1>{t("welcome")} Admin!</h1>
                                <br/>
                                <h1>{t("welcome message")}</h1>
                            </div>
                            {/* User Manager */}
                            <UserManager className={"p-5 flex flex-col mr-20 ml-20"}/>
                        </div>
                    </div>
                    {/* Bottom Half */}
                    <SubmissionManager/>
                </div>
            </div>
        )
    }
    else if (isAdminUser === 0){
        return (
            <div>
                <p>GET OUT!</p>
                <AdminButton
                    func={adminUser}
                    username={username}
                    label={`Bliv Admin`}
                />
            </div>
        )
    }

    return <div>
        <p>What the helly. This ain't supposed to happen</p>
        <br/>
        <p>isAdminUser: {JSON.stringify(isAdminUser)}</p>
    </div>
}

function AdminButton({ func, username, label }){
    return (
        <button onClick={() => {async function buttonclick(){
            const response = await func(username);
            if (response){
                window.location.reload();
            }
        }
        buttonclick();
        }}
        className="border hover:bg-gray-300 transition-colors rounded p-0.5">{label}</button>
    )
}

