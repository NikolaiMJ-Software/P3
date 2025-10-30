import { API } from './api.jsx'
const API_URL = `${API}/user`; //backend address

export async function getUsers(){
    const response = await fetch(API_URL);
    return response.json();
}

export async function isAdmin(username){
    const response = await fetch(`${API_URL}/admin/${username}`);
    return response.json();
}

export async function postAdmin(username, admin){


    const response = await fetch(`${API_URL}/admin/${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok){
        throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return response.text();
}

