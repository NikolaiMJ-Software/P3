import React, { useState, useEffect } from "react";
import { getSoundsampleFile } from "../../services/soundSampleService";

export default function MediaPlayer({soundSample}){
    if (soundSample === null) {
        return null;
    }
console.log("dette er en fil: ", soundSample)
    // Check if link or file
    if (soundSample.includes("https://")){
        // Find the type of link: (YouTube, Instagram, X, Facebook, TikTok)
        let yt = getYtId(soundSample); // Try to get a YouTube video ID
        if (yt) {
            // If it's a YouTube video, show it using an iframe player.
            return (
                <iframe
                    className="w-96 h-56"
                    src={"https://www.youtube.com/embed/" + yt}
                    title="YouTube sample"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                />
            );
        }
    } else {
        // Find the type of file: (mp4, mov, webm)
        return <FindFileType fileName={soundSample} />;
    }
}

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

function FindFileType({ fileName }) {
    const [filePath, setFilePath] = useState(null);
    const [fileType, setFileType] = useState(null); // "video" | "audio" | "link" | null
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try{
                setError(null);
                setFilePath(null);
                setFileType(null);

                const path = await getSoundsampleFile(fileName);
                if (cancelled) return;

                let type = "other";
                if (/\.(mp4|webm|mov|m4v)(\?.*)?$/.test(path)) {
                    type = "video";
                } else if (/\.(mp3|wav|ogg|m4a|flac)(\?.*)?$/.test(path)) {
                    type = "audio";
                }

                setFilePath(path);
                setFileType(type);
            } catch (err) {
                if(!cancelled) {
                    console.error(err);
                    setError("Kunne ikke indlæse filen.")
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [fileName]);

    if(error) {
        return <p className="text-red-600 text-sm">{error}</p>;
    }

    if (!filePath || !fileType){
        return <p className="text-sm text-gray-500">Indlæser fil…</p>;
    }
    
    // --- Check if it's a video file by seeing if the URL ends in .mp4, .webm, .mov, etc ---
    if (fileType === "video") {
        return (
            <video
                className="w-96"
                src={filePath}
                controls
                preload="metadata"
                onError={function(){ console.error("Video failed:", filePath); }} // Logs error if video can't play
            />
        );
    }

    // --- Check if it's an audio file like .mp3, .wav, .ogg, etc ---
    if (fileType === "audio") {
        return (
            <audio
                className="w-96"
                src={filePath}
                controls
                preload="metadata"
                onError={function(){ console.error("Audio failed:", filePath); }} // Logs error if audio can't play
            />
        );
    }

    // if its not a file return not supported
    return <p className="text-sm text-gray-700">Denne filtype understøttes ikke.</p>;
}