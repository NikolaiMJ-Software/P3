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
            <p>Hello there</p>
        )
    }
}
