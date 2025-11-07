import { useState } from "react";
import { useParams } from "react-router-dom";
import { addSoundSample, deleteSoundSample, getSoundSamples } from "../services/soundSampleService";
import { getIdByUser } from "../services/adminService.jsx"

// This is a page to showcase the functionality of submitting a sound sample via file upload or URL input.
export default function SubmitSSTestPage() {

    // Setup variables
    const [link, setUrl] = useState("");
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const { username } = useParams();

    // Handles sound sample submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Sanitize input
        const trimmedLink = link?.trim();

        // Get the user ID from the backend
        let userId;
        try {
            userId = await getIdByUser(username);
            console.log('userID: ',userId)
        } catch (error) { 
            console.error("Failed to fetch user ID:", error);
            setMessage("Failed to fetch user ID: " + error.message);
            return;
        }

        // Submit sound sample
        try {
            const resText = await addSoundSample(trimmedLink, file, userId);
            console.log('TEXT JA JA:', resText);
            setMessage(resText);
        } catch (error) {
            console.error("Upload failed:", error);
            setMessage("Upload failed: " + error.message);
        }
    }

    // Handles sound sample deletion
    const handleDelete = async () => {
        // Remove whitespace from inputs
        const trimmedLink = link?.trim();
        const trimmedFileName = fileName?.trim();

        // Validate input
        if (!trimmedLink && !trimmedFileName) {
            setMessage("Please provide a link or file name for deletion.");
            return;
        }

        // Delete sound sample
        try {
            const resText = await deleteSoundSample(trimmedLink, trimmedFileName);
            setMessage(resText);
        } catch (error) {
            console.error("Deletion failed:", error);
            setMessage("Deletion failed: " + error.message);
        }
    }

    const playSoundSamples = async () => {
        let quickShuffle = false;
        let weightedShuffle = false;
        let soundSample;
        // Get sound sample
        try {
            const res = await getSoundSamples(quickShuffle, weightedShuffle);
            soundSample = res;
        } catch (error) {
            console.error("Get all Sound samples failed:", error);
        }
        console.log(soundSample);
    }

    // HTML of the page
    return (
        <div className={"p-10"}>
            <form className={"w-full max-w-full h-fit border-2 border-black p-8 flex flex-col items-center gap-3"}>
                {/* URL input */}
                <div className="flex justify-center">
                    <label>
                        <input
                            className="border px-2 py-1 rounded w-64"
                            type="text" 
                            placeholder="Insert link..."
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </label>
                </div>

                <div className="flex justify-center">
                    Or
                </div>

                {/* File picker */}
                <div className="flex justify-center">
                    <label className="px-4 py-1 transition-colors cursor-pointer bg-white hover:bg-gray-300 border">
                        Browse
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ display: "none" }}
                        />
                    </label>
                </div>
                <div className="flex justify-center items-center min-h-4">
                    {file && <div className="flex items-center text-sm text-gray-600">File: {file.name}</div>}
                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-6">
                    <button className="px-6 py-2 rounded-2xl text-white bg-blue-500 hover:bg-blue-600"
                    type="button"
                    onClick={handleSubmit}>
                        Submit
                    </button>
                    {/*<button className="px-6 py-2 rounded-2xl text-white bg-red-500 hover:bg-red-700"
                    type="button"
                    onClick={handleDelete}
                    >
                    Delete
                    </button>*/}
                </div>

                {/* 
                // File name for deletion
                <div className="w-full flex flex-col items-center">
                    <label className="flex flex-col items-center">
                    <input
                        className="border px-2 py-1 rounded w-64"
                        type="text"
                        placeholder="File name for deletion..."
                        onChange={(e) => setFileName(e.target.value)}
                    />
                    </label>
                </div>*/}

                {/* Message */}
                <div className="flex justify-center items-center min-h-6">
                    {message && <div className="text-center text-gray-700">{message}</div>}
                </div>

                {/* JONAS insert media player here */}
                <div className="flex justify-center gap-6">
                    <button className="px-6 py-2 rounded-2xl text-white bg-blue-500 hover:bg-blue-600"
                    type="button"
                    onClick={playSoundSamples}>
                        Get all soundSample
                    </button>
                </div>
            </form>
        </div>
    );
}