import {useParams} from "react-router-dom";
import {isAdmin, postAdmin} from "../services/adminService.jsx"
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

    console.log(isAdminUser)

    if(isAdminUser === 1){
        return (
            <div>
                <p>Hello {username}</p>
                <AdminButton
                    username={username}
                    label={`Unbecome Admin`}
                />
            </div>
        )
    }
    else if (isAdminUser === 0){
        return (
            <div>
                <p>GET OUT!</p>
                <AdminButton
                    username={username}
                    label={`Become Admin`}
                />
            </div>
        )
    }

    return <div>
        <p>What the helly. This ain't supposed to happen</p>
        <br/>
        <p>isAdminUser: ${JSON.stringify(isAdminUser)}</p>
    </div>
}

function AdminButton({ username, label, admin }){
    return (
        <button onClick={() => {async function buttonclick(){
            const response = await postAdmin(username);
            if (response){
                window.location.reload();
            }
        }
        buttonclick();
        }}
        className="border hover:bg-gray-300 transition-colors">{label}</button>
    )
}



