import React, { useState } from "react";
import { getSoundsampleFile } from "../../services/soundSampleService";

export default function MediaPlayer({soundSample, size}){
    if (soundSample === null) {
        return null;
    }

    // Check if link or file
    if (soundSample.includes("https://")){
        // Find the type of link: (YouTube, Instagram, X, Facebook, TikTok)
        let yt = getYtId(soundSample); // Try to get a YouTube video ID
        if (yt) {
            // If it's a YouTube video, show it using an iframe player.
            return (
                <iframe
                    className={size}
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
        //return findFileType(soundSample);
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

async function findFileType(fileName) {
    // Get the file path
    let filePath = await getSoundsampleFile(fileName);
    
    // --- Check if it's a video file by seeing if the URL ends in .mp4, .webm, .mov, etc ---
    if (/\.(mp4|webm|mov|m4v)(\?.*)?$/.test(filePath)) { // RegEx to test the file type
        return (
            <video
                className="w-96"
                src={fileName}
                controls
                preload="metadata"
                onError={function(){ console.error("Video failed:", fileName); }} // Logs error if video can't play
            />
        );
    }

    // --- Check if it's an audio file like .mp3, .wav, .ogg, etc ---
    if (/\.(mp3|wav|ogg|m4a|flac)(\?.*)?$/.test(filePath)) {
        return (
            <audio
                className="w-96"
                src={fileName}
                controls
                preload="metadata"
                onError={function(){ console.error("Audio failed:", fileName); }} // Logs error if audio can't play
            />
        );
    }

    // --- If it's not YouTube, not a video, and not audio — just show a clickable link ---
    return (
      <a
        className="text-blue-600 underline break-all"
        href={filePath}
        target="_blank"
        rel="noopener noreferrer"
      >
        {fileName}
      </a>
    );
}