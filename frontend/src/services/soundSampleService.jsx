import { API } from './api.jsx'
const API_URL = `${API}/sound-sample`; //backend address

async function getSoundSamples(quick = false, weighted = false) {
    const res = await fetch(`${API_URL}?quick=${quick}&weighted=${weighted}`);
    return res.json();
}

async function addSoundSample(file, soundSample) {
    const formData = new FormData();
    if (file) {
        formData.append("file", file);
    }
    formData.append("soundSample", JSON.stringify(soundSample));

    const response = await fetch(`${API}/upload`, {
        method: "POST",
        body: formData
    });

    return response.text();
}

async function deleteSoundSample(link, fileName) {
    const res = await fetch(`${API}/delete`, { 
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link, fileName })
    });

    return res.text();
}

export { getSoundSamples, addSoundSample, deleteSoundSample };