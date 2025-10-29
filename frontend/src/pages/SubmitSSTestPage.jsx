import { useState } from "react";
import { useParams } from "react-router-dom";

// This is a page to showcase the functionality of submitting a sound sample via file upload or URL input.
export default function SubmitSSTestPage() {

    // Setup variables
    const [link, setUrl] = useState("");
    const [file, setFile] = useState(null)
    const [fileName, setFileName] = useState("");
    const [message, setMessage] = useState("");
    const { username } = useParams();

    // Handles sound sample submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // First if all, get the user ID from the backend
        let userId = null;
        try {
            const response = await fetch(`http://localhost:8080/users/id/${username}`);
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            userId = await response.text();
        } catch (error) {
            console.error("Failed to fetch user ID:", error);
            setMessage("Failed to fetch user ID: " + error.message);
            return;
        }

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
        try {
            const response = await fetch("http://localhost:8080/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
            }
            const resultText = await response.text();
            setMessage(resultText);
        } catch (error) {
            console.error("Upload failed:", error);
            setMessage("Upload failed: " + error.message);
        }
    }

    const handleDelete = async () => {
        const trimmedLink = link?.trim();
        const trimmedFileName = fileName?.trim();

        if (!trimmedLink && !trimmedFileName) {
            setMessage("Please provide a link or file name for deletion.");
            return;
        }

        const formData = new FormData();
        if (trimmedLink) {
            formData.append("link", trimmedLink);
        } else if (trimmedFileName) {
            formData.append("fileName", trimmedFileName);
        }

        try{
            const response = await fetch("http://localhost:8080/api/delete", {
                method: "DELETE",
                body: formData,
            });
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            const resultText = await response.text();
            setMessage(resultText);
        } catch (error) {
            console.error("Deletion failed:", error);
            setMessage("Deletion failed: " + error.message);
        }

    }

    // HTML of the page
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    File input:
                    <input type="file" onChange={(e) => setFile(e.target.files[0])}/>
                </label>
            </div>
            <div>
                <label>
                    URL input:
                    <input type="String" onChange={(e) => setUrl(e.target.value)}/>
                </label>
            </div>
            <div>
                <label>
                    File name for deletion:
                    <input type="String" onChange={(e) => setFileName(e.target.value)}/>
                </label>
            </div>
            <button type="submit">Submit</button>
            <button type="button" onClick={handleDelete}>Delete</button>
            {message && <p>{message}</p>}
        </form>
    );
}