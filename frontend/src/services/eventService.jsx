import { API } from './api.jsx'
const API_URL = `${API}/event`; //backend address

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
        const response = fetch(`${API_URL}/delete/${id}`);
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.log("Error deleting event: ", error);
        throw error;
    }
}