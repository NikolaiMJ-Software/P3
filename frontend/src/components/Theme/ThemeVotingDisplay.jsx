import { useState, useEffect } from "react";

export default function ThemeVotingDisplay({ theme, startTime, onTimerClick, resetKey }) {
  const [timeLeft, setTimeLeft] = useState(startTime);

  useEffect(() => {
    setTimeLeft(startTime);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, resetKey]); // resetKey triggers timer restart

  if (!theme) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="relative flex flex-col h-full bg-text-secondary text-white p-6">
      {/* Timer (top right corner) */}
      <div
        className="absolute top-4 right-6 text-lg font-semibold bg-black/50 px-3 py-1 rounded-lg cursor-pointer hover:bg-black/70"
        onClick={onTimerClick}
        title="Click to reset or change timer"
      >
        {minutes}:{seconds}
      </div>

      {/* Theme name */}
      <h1 className="text-2xl font-semibold text-center mb-6">{theme.name}</h1>

      {/* Posters */}
      <div className="flex-1 flex flex-wrap justify-center gap-6">
        {theme.posters?.length > 0 ? (
          theme.posters.map((poster, idx) => (
            <img
              key={idx}
              src={poster}
              alt={`Poster ${idx}`}
              className="w-44 rounded-xl shadow-md"
            />
          ))
        ) : (
          <p>No posters found for this theme.</p>
        )}
      </div>

      {/* Drinking rules */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2 text-center">Drinking Rules</h2>
        <ul className="list-disc list-inside text-center space-y-1">
          {theme.drinkingRules?.length > 0 ? (
            theme.drinkingRules.map((rule, idx) => <li key={idx}>{rule}</li>)
          ) : (
            <li>No rules listed.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
