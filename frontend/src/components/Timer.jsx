import { useState, useEffect } from "react";

export default function Timer({
  //variables to determine time, resetkey, onexpire value and class for the buttons  
  initialSeconds = 60,
  resetKey,
  onExpire,
  className = "",
}) {
  const [duration, setDuration] = useState(initialSeconds);
  const [remaining, setRemaining] = useState(initialSeconds);
  const [running, setRunning] = useState(false);

  const [displayValue, setDisplayValue] = useState(formatTime(initialSeconds));
  const [isEditing, setIsEditing] = useState(false);

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
  };

  const handleStop = () => {
    setRunning(false);
  };

  const handleRestart = () => {
    setRemaining(duration);
    setRunning(true);
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

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Start */}
      <button
        onClick={handleStart}
        className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white"
      >
        Start
      </button>

      {/* Stop */}
      <button
        onClick={handleStop}
        className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
      >
        Stop
      </button>

      {/* Restart */}
      <button
        onClick={handleRestart}
        className="px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white"
      >
        Restart
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
        className="text-xl font-semibold border px-4 py-2 rounded-md bg-transparent text-center w-24"
        aria-label="Timer (mm:ss)"
      />
    </div>
  );
}


