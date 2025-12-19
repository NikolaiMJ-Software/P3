import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import endSound from "../assets/Timer_Sound.mp3";

//timer component seen in ss and theme vote page
export default function Timer({
  //variables to determine time, resetkey, onexpire value and class for the buttons  
  initialSeconds = 60,
  resetKey,
  onExpire,
  onStop,
  className = "",
}) {
  const {t} = useTranslation();

  // Timer state
  const [duration, setDuration] = useState(initialSeconds);
  const [remaining, setRemaining] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  // Editable display state
  const [displayValue, setDisplayValue] = useState(formatTime(initialSeconds));
  const [isEditing, setIsEditing] = useState(false);

  // Timer expiration state
  // True only when time has reached zero and the end logic has executed
  const isExpired = remaining <= 0 && hasEnded;

  // Reference to the audio element used for the end sound
  const audioRef = useRef(null);

  // Initialize the audio object once when the component mounts
  useEffect(() => {
    audioRef.current = new Audio(endSound);
  }, []);


  // Converts seconds into a MM:SS formatted string
  function formatTime(s) {
    const m = Math.floor(s / 60); //calculate seconds into minutes
    const sec = s % 60; //calculates remaning seconds
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`; //return timer
  }


  // Parses user input into seconds
  // Supports formats like "90", "01:30", or "00:45"
  function parseTimeString(str) {

    const trimmed = str.trim();
    if (!trimmed) return null;

    // Handle MM:SS format
    if (trimmed.includes(":")) {
      //calculate minutes and seconds
      const [mm, ss] = trimmed.split(":");
      const minutes = parseInt(mm, 10);
      const seconds = parseInt(ss, 10);

      // Validate parsed values
      if (//if specific values are missing or wrong, return null
        isNaN(minutes) ||
        isNaN(seconds) ||
        minutes < 0 ||
        seconds < 0 ||
        seconds >= 60
      ) {
        return null;
      }
      return minutes * 60 + seconds;
    }

     // Handle plain seconds input
    const seconds = parseInt(trimmed, 10);
    if (isNaN(seconds) || seconds <= 0) return null;
    return seconds;
  }

  // Reset the timer when resetKey or duration changes
  useEffect(() => {
    setRemaining(duration); //resets reamning time
    setRunning(false); //stops it from running
    setDisplayValue(formatTime(duration)); //display original time
  }, [resetKey, duration]);

  // Update display when the remaining time changes
  // (only if the user is not actively editing)
  useEffect(() => {
    if (!isEditing) {
      setDisplayValue(formatTime(remaining));
    }
  }, [remaining, isEditing]);

  // Countdown effect while the timer is running
  useEffect(() => {
    if (!running) return;

    // Stop timer when time reaches zero
    if (remaining <= 0) {
      setRunning(false);
      if (onExpire) onExpire();
      return;
    }

    // Decrease remaining time every second
    const interval = setInterval(() => {
      setRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [running, remaining, onExpire]);

   // Start the timer
  const handleStart = () => {
    if (remaining <= 0) {
      setRemaining(duration); // Restart if time already expired
    }
    setRunning(true);
    setHasEnded(false);
    stopSound();
  };

   // Stop the timer manually
  const handleStop = () => {
    setRunning(false);
    setHasEnded(false);
    stopSound();
    if (onStop) onStop();
  };

  // Restart the timer from the original duration
  const handleRestart = () => {
    setRemaining(duration);
    setRunning(true);
    setHasEnded(false);
    stopSound();
  };


  // Commit edited time input
  const commitDisplayValue = () => {
    const secs = parseTimeString(displayValue);
    if (secs === null) {
      alert("Please enter a valid time (e.g. 00:30, 1:30, or 45)");
      setDisplayValue(formatTime(remaining));
    } else {
      setDuration(secs);
      setRemaining(secs);
      setDisplayValue(formatTime(secs));
      setHasEnded(false);
      stopSound();
    }
    setIsEditing(false);
  };

  // Handle keyboard input while editing the time
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitDisplayValue();
    } else if (e.key === "Escape") {
      setDisplayValue(formatTime(remaining));
      setIsEditing(false);
      e.target.blur();
    }
  };

  // Play sound when timer reaches zero (once)
  useEffect(() => {
    if (!running) return;

    if (remaining === 0 && !hasEnded) {
        setHasEnded(true);
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
        }
    }
  }, [remaining, hasEnded,  running]);

  // Stop and reset the end sound
  const stopSound = () => {
    const audio = audioRef.current;
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
  };



  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Start */}
      <button
        onClick={handleStart}
        className="btn-primary bg-btn-green hover:bg-btn-green-hover text-btn-text"
      >
        Start
      </button>

      {/* Stop */}
      <button
        onClick={handleStop}
        className="btn-primary bg-btn-red hover:bg-btn-red-hover text-btn-text"
      >
        Stop
      </button>

      {/* Restart */}
      <button
        onClick={handleRestart}
        className="btn-primary bg-btn-yellow hover:bg-btn-yellow-hover text-btn-text"
      >
        {t("restart")}
      </button>

      {/* Editable Timer */}
      <input
        value={displayValue}
        onChange={(e) => {
          setDisplayValue(e.target.value);
          setIsEditing(true);
        }}
        onBlur={commitDisplayValue}
        onKeyDown={handleInputKeyDown}
        aria-label="Timer (mm:ss)"
        className={`text-xl font-semibold border px-4 py-2 rounded-md bg-transparent text-center w-24 transition-all
        ${isExpired ? "border-btn-red text-btn-red animate-flash" : ""} `}
      />
    </div>
  );
}


