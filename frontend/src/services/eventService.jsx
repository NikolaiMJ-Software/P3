import { API } from './api.jsx'
const API_URL = `${API}/event`;
 //backend address

export async function getEvents(){

    try {
        const response = await fetch(`${API_URL}/all`);
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        return await response.json();   // events come as JSON
    } catch (error) {
        console.log("Error getting events: ", error);
        throw error;
    }
}

export async function getFutureEvents(){

    try {
        const response = await fetch(`${API_URL}/future`);
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        return await response.json();   // events come as JSON
    } catch (error) {
        console.log("Error getting events: ", error);
        throw error;
    }
}


// Handles uploading of events
export async function uploadEvent(LocalDate, themeId){
    try {
        const response = await fetch(`${API_URL}/upload/${LocalDate}/${themeId}`, {method: "PUT",});
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.log("Error uploading event: ", error);
        throw error;
    }
}

// Handles deletion of events
export async function deleteEvent(id) {
    try {
        const response = await fetch(`${API_URL}/delete/${id}`);
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.log("Error deleting event: ", error);
        throw error;
    }
}


// Handles getting next event
export async function getNextEvent() {
  try {
    const response = await fetch(`${API_URL}/next`);
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log("Error getting next event: ", error);
    throw error;
  }
}

export async function updateDate(id, date) {
    try {
        const response = await fetch(`${API_URL}/changeDate/${id}`,{
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(date),
        });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`)
        }
        return await response.text()
    } catch (error) {
        console.log("Error updating event date", error);
        throw error;
    }
}