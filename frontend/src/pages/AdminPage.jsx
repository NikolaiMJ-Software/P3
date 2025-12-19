import {useNavigate, useParams} from "react-router-dom";
import {isAdmin} from "../services/adminService.jsx"
import {useEffect, useState} from "react";
import UserManager from "../components/UserManager.jsx";
import EventManager from "../components/EventManager.jsx";
import SubmissionManager from "../components/SubmissionManager.jsx";
import { useTranslation } from "react-i18next";

export default function AdminPage(){
    // Consts
    const {username} = useParams();
    const [isAdminUser, setIsAdminUser] = useState(undefined);
    const {t} = useTranslation();
    const navigate = useNavigate();

    //check if {username} is admin
    useEffect(() => {
        async function checkAdmin() {
            const result = await isAdmin(username);
            setIsAdminUser(result);
        }
        checkAdmin();
    }, [username]);

    console.log(isAdminUser)

    // Render the admin page if admin
    if(isAdminUser === 1){
        return (
            <div className="flex flex-col">
                {/* Top Half */}
                <div className="flex flex-row justify-between w-full">
                    {/* Event Manager */}
                    <EventManager className={"flex flex-col p-5 w-1/2"}/>
                    {/* Upper Right */}
                    <div className="bg-primary flex flex-col justify-between w-1/2">
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
        )
    }
    // Navigate the user to homepage if not admin
    else if (isAdminUser === 0){
        return (
            navigate(`/${username}`)
        )
    }
    // Error message if the user is both admin and not admin (?)
    return <div>
        <p>{t("adminError")}</p>
        <br/>
        <p>isAdminUser: {JSON.stringify(isAdminUser)}</p>
    </div>
}
