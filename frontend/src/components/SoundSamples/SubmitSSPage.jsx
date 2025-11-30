import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { addSoundSample } from "../../services/soundSampleService";
import { getIdByUser } from "../../services/adminService.jsx";
import { useTranslation } from "react-i18next";
import MediaPlayer from "./MediaPlayer.jsx";

// This is a page to showcase the functionality of submitting a sound sample via file upload or URL input.
export default function SubmitSSPage() {
    const {t} = useTranslation();

    // Setup variables
    const [link, setUrl] = useState("");
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const { username } = useParams();
    const [validSS, setValidSS] = useState(null);

    // Handles sound sample submission
    const handleSubmit = async () => {

        // Sanitize input
        const trimmedLink = link?.trim();
        if (trimmedLink && !trimmedLink.includes("https://")) {
            console.error("Not a link: " + trimmedLink);
            setMessage("Not a link: " + trimmedLink);
            return;
        }

        // Get the user ID from the backend
        let userId;
        try {
            userId = await getIdByUser(username);   
        } catch (error) { 
            console.error("Failed to fetch user ID:", error);
            setMessage("Failed to fetch user ID: " + error.message);
            return;
        }

        // Submit sound sample and reset input
        const resText = await addSoundSample(trimmedLink, file, userId);
        setMessage(resText);
        if (resText === "Upload complete!") {
            let soundSample = file !== null ? file.name : trimmedLink
            setValidSS(soundSample);
        }
        setFile(null);
        setUrl("");
        document.getElementById("textField").value = "";
    }

    const sendMessage = () => {
        if(!message) {
            return null;
        } else if(message.includes("Upload complete!")){
            return <div className="text-center text-text-primary">{message}</div>;
        }
        return <div className="text-center text-text-error">{message}</div>;
    }

    // HTML of the page
    return (
        <div className={"p-10 relative"}>
            <div className={"w-full max-w-full h-fit border-2 border-text-primary rounded-3xl p-8 flex flex-col items-center gap-3"}>
                {/* URL input */}
                <div className="flex justify-center">
                    <input
                        id="textField"
                        className="border px-2 py-1 rounded w-64"
                        type="text" 
                        placeholder={t("insertLink")}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleSubmit())}
                    />
                </div>

                <div className="flex justify-center">
                    {t("or")}
                </div>

                {/* File picker */}
                <div className="flex justify-center">
                    <label className="px-4 py-1 transition-colors cursor-pointer bg-white hover:bg-btn-hover-secondary border">
                        {t("browse")}
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ display: "none" }}
                        />
                    </label>
                </div>
                <div className="flex justify-center items-center min-h-5">
                    {file && <div className="flex items-center text-sm text-text-secondary">{t("file")}: {file.name}</div>}
                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-6">
                    <button className="btn-primary"
                        type="button"
                        onClick={() => handleSubmit()}>
                        {t("submit")}
                    </button>
                </div>

                {/* Message */}
                <div className="flex justify-center items-center min-h-6">
                    {sendMessage()}
                </div>

                <MediaPlayer soundSample={validSS}/>
            </div>
        </div>
    );
}