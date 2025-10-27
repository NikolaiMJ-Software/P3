import { useState } from "react";

export default function SubmitSSTestPage() {

    const [url, setUrl] = useState("");
    const [file, setFile] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("url", url);
        formData.append("file", file);

        
    }

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
                    <input type="String" value="url" onChange={(e) => setUrl(e.target.value)}/>
                </label>
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}