const API_URL = "http://localhost:8080/api/users"; //backend address

export async function getUsers(){
    const response = await fetch(API_URL);
    return response.json();
}