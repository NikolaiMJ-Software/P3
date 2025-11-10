import { API } from './api.jsx'
const API_URL = `${API}/sound-sample`; //backend address

async function getSoundSamples(quick = false, weighted = false) {
    const res = await fetch(`${API_URL}/get-all?quick=${quick}&weighted=${weighted}`);
    return res.json();
}

async function addSoundSample(link, file, userId) {
    // Setup sound sample object and convert to JSON
    const soundSample = {
        link: link,
        filePath: null,
        userId: userId
    };
    const soundSampleJson = JSON.stringify(soundSample);

    // Create data form for soundsample and file
    const formData = new FormData();
    formData.append("soundSample", soundSampleJson);
    if(file) formData.append("file", file);  

    // Send POST request to backend
    const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
    }

    return response.text();
}

// Create data form for sound sample deletion (with either link or file name)
async function deleteSoundSample(link, fileName) {
    const formData = new FormData();
    if (link) {
        formData.append("link", link);
    } else if (fileName) {
        formData.append("fileName", fileName);
    }

    // Send DELETE request to backend
    const response = await fetch(`${API_URL}/delete`, {
        method: "DELETE",
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
    }

    return response.text();
}

async function getSoundsampleFile(filePath) {
    try {
        const res = await fetch(`${API_URL}/download?filePath=${filePath}`);
        return res.json();
    } catch (error) {
        console.error(`Failed to get file: ${filePath} `, error);
    }
}

export { getSoundSamples, addSoundSample, deleteSoundSample, getSoundsampleFile };