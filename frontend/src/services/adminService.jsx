const API_URL = "http://localhost:8080/api/user"; //backend address

export async function getUsers(){
    const response = await fetch(API_URL);
    return response.json();
}

export async function isAdmin(username){
    const response = await fetch(`${API_URL}/admin/${username}`);
    return response.json();
}

