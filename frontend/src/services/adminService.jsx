import { API } from './api.jsx'
import {useParams} from "react-router-dom";
const API_URL = `${API}/user`; //backend address

export async function getUsers(){
    const response = await fetch(API_URL);
    return response.json();
}

export async function isAdmin(username){
    const response = await fetch(`${API_URL}/admin/${username}`);
    return response.json();
}

export async function postAdmin(username){
    const response = await fetch(`${API_URL}/admin/${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok){
        throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return response.text();
}

export async function banUser(user){
    const {username} = useParams();
    const body = { username, user };
    const response = await fetch(`${API_URL}/admin/ban_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body
    });
}