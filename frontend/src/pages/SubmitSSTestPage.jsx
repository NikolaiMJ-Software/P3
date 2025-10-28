import { useState } from "react";

// This is a page to showcase the functionality of submitting a sound sample via file upload or URL input.
export default function SubmitSSTestPage() {

    // Setup variables
    const [link, setUrl] = useState("");
    const [file, setFile] = useState(null)
    const [message, setMessage] = useState("");

    // Handles sound sample submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Setup sound sample object and convert to JSON
        const soundSample = {
            link: link,
            filePath: null,
            userId: 1
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
            <button type="submit">Submit</button>
            {message && <p>{message}</p>}
        </form>
    );
}