import {useParams} from "react-router-dom";
import {isAdmin} from "../services/adminService.jsx"
import {useEffect, useState} from "react";


export default function AdminPage(){
    const {username} = useParams();
    const [isAdminUser, setIsAdminUser] = useState(false);
    //check if {username} is admin
    useEffect(() => {
        async function checkAdmin() {
            try{
                const result = await isAdmin(username);
                setIsAdminUser(result);
            } catch (e) {
                console.error("Error checking admin:", err);
            }
        }
        checkAdmin();
    }, [username]);

    if(!isAdminUser){
        return `GET OUT!`
    }

    return `Hello ${username}!`
}