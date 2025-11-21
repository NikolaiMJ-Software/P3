import { API } from './api.jsx'
const API_URL = `${API}/user`; //backend address

// GETS

export async function getUsers(){
    const response = await fetch(API_URL);
    return response.json();
}

export async function getIdByUser(username) {
    const response = await fetch(`${API_URL}/id/${username}`);
    if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
    }
    return response.text();
}

export async function isAdmin(username){
    const response = await fetch(`${API_URL}/admin/${username}`);
    return response.json();
}

export async function fullName(id){
    const response = await fetch(`${API_URL}/full_name/${id}`)
    return response.text()
}

// POSTS

export async function adminUser(username, newAdmin){
    const response = await fetch(`${API_URL}/admin/${username}?newAdmin=${newAdmin}&status=1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });
    return response.text();
}

export async function unadminUser(username, newAdmin){
    const response = await fetch(`${API_URL}/admin/${username}?newAdmin=${newAdmin}&status=0`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });
    return response.text();
}

export async function banUser(body){
    const response = await fetch(`${API_URL}/admin/ban_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    return response.text();
}

export async function unbanUser(body){
    const response = await fetch(`${API_URL}/admin/unban_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    return response.text();
}

