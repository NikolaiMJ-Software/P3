import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import endSound from "../assets/Timer_Sound.mp3";

export default function Timer({
  //variables to determine time, resetkey, onexpire value and class for the buttons  
  initialSeconds = 60,
  resetKey,
  onExpire,
  onStop,
  className = "",
}) {
  const {t} = useTranslation();
  const [duration, setDuration] = useState(initialSeconds);
  const [remaining, setRemaining] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);


  const [displayValue, setDisplayValue] = useState(formatTime(initialSeconds));
  const [isEditing, setIsEditing] = useState(false);

  const isExpired = remaining <= 0 && hasEnded;
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(endSound);
  }, []);


  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }


  function parseTimeString(str) {
    const trimmed = str.trim();
    if (!trimmed) return null;

    if (trimmed.includes(":")) {
      const [mm, ss] = trimmed.split(":");
      const minutes = parseInt(mm, 10);
      const seconds = parseInt(ss, 10);
      if (
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

    const seconds = parseInt(trimmed, 10);
    if (isNaN(seconds) || seconds <= 0) return null;
    return seconds;
  }

  useEffect(() => {
    setRemaining(duration);
    setRunning(false);
    setDisplayValue(formatTime(duration));
  }, [resetKey, duration]);

  useEffect(() => {
    if (!isEditing) {
      setDisplayValue(formatTime(remaining));
    }
  }, [remaining, isEditing]);

  useEffect(() => {
    if (!running) return;

    if (remaining <= 0) {
      setRunning(false);
      if (onExpire) onExpire();
      return;
    }

    const interval = setInterval(() => {
      setRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [running, remaining, onExpire]);

  const handleStart = () => {
    if (remaining <= 0) {
      setRemaining(duration);
    }
    setRunning(true);
    setHasEnded(false);
    stopSound();
  };

  const handleStop = () => {
    setRunning(false);
    setHasEnded(false);
    stopSound();
    if (onStop) onStop();
  };

  const handleRestart = () => {
    setRemaining(duration);
    setRunning(true);
    setHasEnded(false);
    stopSound();
  };


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
        className="btn-primary bg-btn-green hover:bg-btn-green-hover text-white"
      >
        Start
      </button>

      {/* Stop */}
      <button
        onClick={handleStop}
        className="btn-primary bg-btn-red hover:bg-btn-red-hover text-white"
      >
        Stop
      </button>

      {/* Restart */}
      <button
        onClick={handleRestart}
        className="btn-primary bg-btn-yellow hover:bg-btn-yellow-hover text-white"
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


