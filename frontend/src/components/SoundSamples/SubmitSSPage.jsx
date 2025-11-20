import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { addSoundSample, getSoundSamples, getSoundsampleFile } from "../../services/soundSampleService";
import { getIdByUser } from "../../services/adminService.jsx"
import { useTranslation } from "react-i18next";
import MediaPlayer from "./MediaPlayer.jsx"

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
    const handleSubmit = async (e) => {
        e.preventDefault();

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
            console.log('userID: ',userId)
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
            <form className={"w-full max-w-full h-fit border-2 border-text-primary rounded-3xl p-8 flex flex-col items-center gap-3"}>
                {/* URL input */}
                <div className="flex justify-center">
                    <label>
                        <input
                            id="textField"
                            className="border px-2 py-1 rounded w-64"
                            type="text" 
                            placeholder={t("insertLink")}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </label>
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
                        onClick={(e) => handleSubmit(e)}>
                        {t("submit")}
                    </button>
                </div>

                {/* Message */}
                <div className="flex justify-center items-center min-h-6">
                    {sendMessage()}
                </div>

                <div className="flex justify-center gap-6">
                    <MediaPlayer soundSample={validSS}/>
                </div>
            </form>
        </div>
    );
}
/*

<div className="w-full mt-6 flex flex-col items-center gap-6">
  {samples.map(function (s, i) {
    // If there is a soundSample, convert it to a string and remove extra spaces.
    // If there isn’t one, set it to an empty string.
    var raw = s && s.soundSample ? String(s.soundSample).trim() : "";
    if (!raw) return null; // If nothing is there, stop and return nothing.

    // If the URL starts with "/", add the website address in front
    // so it becomes a full URL. Otherwise, just use it as is.
    var url = raw.charAt(0) === "/" ? (window.location.origin + raw) : raw;
    var lower = url.toLowerCase(); // Make it all lowercase so we can check file types easily.

    // --- Function to check if the URL is a YouTube link and get the video ID ---
    function getYtId(u) {
      try {
        var x = new URL(u); // Tries to read the link as a real URL.
        
        // If it's a short YouTube link like https://youtu.be/abcd
        if (x.hostname.indexOf("youtu.be") !== -1) {
          // Split after the "/" and get the video ID part.
          var parts = x.pathname.split("/").filter(Boolean);
          return parts[0] || null;
        }

        // If it's a normal YouTube link like youtube.com/watch?v=abcd
        if (x.hostname.indexOf("youtube.com") !== -1) {
          return x.searchParams.get("v"); // Get the value of the "v" parameter (the video ID).
        }
      } catch (e) {} // If something goes wrong, just ignore it.
      return null; // If no ID is found, return null.
    }

    var yt = getYtId(url); // Try to get a YouTube video ID
    if (yt) {
      // If it's a YouTube video, show it using an iframe player.
      return (
        <iframe
          key={i}
          className="w-96 h-56"
          src={"https://www.youtube.com/embed/" + yt}
          title="YouTube sample"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      );
    }

    // --- Check if it's a video file by seeing if the URL ends in .mp4, .webm, .mov, etc ---
    if (/\.(mp4|webm|mov|m4v)(\?.*)?$/.test(lower)) { // RegEx to test the file type
      return (
        <video
          key={i}
          className="w-96"
          src={url}
          controls
          preload="metadata"
          onError={function(){ console.error("Video failed:", url); }} // Logs error if video can't play
        />
      );
    }

    // --- Check if it's an audio file like .mp3, .wav, .ogg, etc ---
    if (/\.(mp3|wav|ogg|m4a|flac)(\?.*)?$/.test(lower)) {
      return (
        <audio
          key={i}
          className="w-96"
          src={url}
          controls
          preload="metadata"
          onError={function(){ console.error("Audio failed:", url); }} // Logs error if audio can't play
        />
      );
    }

    // --- If it's not YouTube, not a video, and not audio — just show a clickable link ---
    return (
      <a
        key={i}
        className="text-blue-600 underline break-all"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {raw}
      </a>
    );
  })}
</div>

*/