import {useParams} from "react-router-dom";
import {getUsers} from "../services/adminService.jsx"
import {useEffect, useState} from "react";


export default function AdminPage(){
    const {username} = useParams();
    //check if {username} is admin
    if (!isAdmin(username)){
        return `GET OUT!`
    }

    return `Hello ${username}!`
}

function isAdmin(user){
    const [users, setUsers] = useState([]);
    useEffect(() => {
        getUsers().then(setUsers)
    }, []);

    let a = users.find(({username}) => username.toString().toLowerCase() === user.toLowerCase());

    if (a){
        return a.admin;
    }
}