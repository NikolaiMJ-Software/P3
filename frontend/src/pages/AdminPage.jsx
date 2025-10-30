import {useParams} from "react-router-dom";
import {isAdmin, postAdmin} from "../services/adminService.jsx"
import {useEffect, useState} from "react";
import UserManager from "../components/UserManager.jsx";


export default function AdminPage(){
    const {username} = useParams();
    const [isAdminUser, setIsAdminUser] = useState(false);
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
                    username={username}
                    label={`Unbecome Admin`}
                />
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between ">
                        <div className="flex-grow-1 border">
                            hello!
                        </div>
                        <div className="flex flex-col">
                            <div className="text-center text-xl">
                                <h1>Welcome Admin!</h1>
                                <br/>
                                <h1>What actions shall we do today my lord?</h1>
                            </div>
                            <UserManager/>
                        </div>
                    </div>
                    <div>
                        hello!
                    </div>
                </div>
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

function AdminButton({ username, label }){
    return (
        <button onClick={() => {async function buttonclick(){
            const response = await postAdmin(username);
            if (response){
                window.location.reload();
            }
        }
        buttonclick();
        }}
        className="border hover:bg-gray-300 transition-colors rounded p-0.5">{label}</button>
    )
}



