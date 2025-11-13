import {useParams} from "react-router-dom";
import {adminUser, isAdmin, unadminUser} from "../services/adminService.jsx"
import {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import Timer from "../components/Timer.jsx";


export default function AdminPage(){
    const {username} = useParams();
    const [isAdminUser, setIsAdminUser] = useState(undefined);
    const [resetKey, setResetKey] = useState(0);
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
            <div className="flex justify-end">
            <Timer
                initialSeconds={1800}
                resetKey={resetKey}
            />
            </div>
        )
    }
}
