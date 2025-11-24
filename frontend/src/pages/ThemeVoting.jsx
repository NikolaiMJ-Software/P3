import { useState, useEffect } from "react";
import { fetchShuffledThemes, updateThemeVotes, deleteTheme } from "../services/themeService";
import { uploadEvent } from "../services/eventService";
import ThemeVotingDisplay from "../components/Theme/ThemeVotingDisplay";
import Timer from "../components/Timer";

export default function ThemeVoting() {
  const [themes, setThemes] = useState([]);
  const [winningThemes, setWinningThemes] = useState([]);
  const [unVotedThemes, setUnVotedThemes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numberOfWinners, setNumberOfWinners] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [timerStart] = useState(60);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const [votingPhase, setVotingPhase] = useState("initial"); // "initial", "ongoing"

  // Fetch all themes on page load
  useEffect(() => {
    async function loadThemes() {
      try {
        const themesData = await fetchShuffledThemes();
        setThemes(themesData);
        setUnVotedThemes(themesData);
      } catch (error) {
        console.error("Error loading themes:", error);
      }
    }
    loadThemes();
  }, []);

  useEffect(() => {
    if (votingPhase === "ongoing" && numberOfWinners > 0) {
      finishVoting();
    }
  }, [votingPhase]);

  // Function to updates votes for the current theme
  const submitVote = (votes) => {
    if (votes === "") {
      alert("Please enter an amount of votes");
      return;
    }
    try {
      // Update votes in unVotedThemes
      const updatedUnvoted = [...unVotedThemes];
      updatedUnvoted[currentIndex] = {
        ...updatedUnvoted[currentIndex],
        votes: votes,
      };
      setUnVotedThemes(updatedUnvoted);

      // Update votes in themes (match by themeId)
      const updatedThemes = themes.map((t) =>
        t.themeId === unVotedThemes[currentIndex].themeId
          ? { ...t, votes: votes }
          : t
      );
      setThemes(updatedThemes);
      
      // Reset input field
      setInputValue("");

    } catch (err) {
      alert("Failed to update votes");
    }
  };

  // Function to end voting and schedule events
  const endVoting = async () => {
    
    // Check if all themes have been voted on
    const unvotedThemes = unVotedThemes.filter(
      (t) => t.votes === null || t.votes === undefined
    );
    if (unvotedThemes.length > 0) {
      alert("All themes must be voted for before ending voting!");
      return;
    }

    // If first time ending voting, prompt for number of winners
    if (numberOfWinners === 0) {
      const numberOfWinners = parseInt(
        prompt("How many themes are allowed to win?"),
        10
      );
      if (isNaN(numberOfWinners) || numberOfWinners <= 0) {
        alert("Please enter a valid positive number.");
        return;
      }
      setNumberOfWinners(numberOfWinners);
      setVotingPhase("ongoing");
      return; // Exit to allow re-clicking "End voting"
    }
  };

  const finishVoting = async () => {
    // Sort and select n winners
    let sorted = [...unVotedThemes].sort((a, b) => (b.votes || 0) - (a.votes || 0));
    let winners = [... winningThemes];

    while (winners.length < numberOfWinners) {
      const currentVotes = sorted[0].votes;
      const tiedThemes = sorted.filter(t => t.votes === currentVotes);

      const remainingSlots = numberOfWinners - winners.length;

      if (tiedThemes.length <= remainingSlots) {
        // They all fit — add them
        winners = [...winners, ...tiedThemes];

        // Remove them from sorted
        sorted = sorted.filter(t => t.votes !== currentVotes);
      } else {
        // Too many tied to fill the remaining slots → trigger tie-break
        setUnVotedThemes(tiedThemes);
        setCurrentIndex(0);
        alert("There is a tie among some themes. Please re-vote to break the tie.");
        return;
      }
    }

    // After the loop finishes:
    setWinningThemes(winners);

    // Prompt date for the first event
    const firstEvent = prompt("Set date of first event in yyyy-mm-dd format");
    if (!firstEvent || !/^\d{4}-\d{2}-\d{2}$/.test(firstEvent)) {
      alert("Please enter a valid date in yyyy-mm-dd format.");
      return;
    }
    const startDate = new Date(`${firstEvent}T16:30:00`);

    // Schedule events for each winner (2 weeks apart)
    for (let i = 0; i < winningThemes.length; i++) {

      const eventDate = new Date(startDate);
      eventDate.setDate(startDate.getDate() + i * 14);
      const formattedDate = eventDate.toISOString().slice(0, 19);

      try {
        const result = await uploadEvent(formattedDate, winningThemes[i].themeId);
        console.log(`Event uploaded for ${formattedDate}:`, result);
      } catch (err) {
        console.error("Failed to upload event:", formattedDate, err);
      }
    }
    setVotingPhase("initial")
  };

// Buttons to navigate themes
const handleNext = () => {
  setCurrentIndex((prev) => (prev + 1) % unVotedThemes.length);
  resetTimer();
};
const handlePrevious = () => {
  setCurrentIndex((prev) => (prev === 0 ? unVotedThemes.length - 1 : prev - 1));
  resetTimer();
};

// Reset the timer to the current timerStart value
const resetTimer = () => {
  // Increment a dummy state to trigger useEffect in ThemeVotingDisplay
  setTimerResetKey((prev) => prev + 1);
};


if (unVotedThemes.length === 0) return <p>Loading themes...</p>;

const currentTheme = unVotedThemes[currentIndex];

return (
    <div className="flex flex-col h-screen">

      {/* Timer at the top right corner */ }
      <div className="flex justify-end p-4 bg-text-secondary">
        <Timer
          initialSeconds={timerStart}
          resetKey={timerResetKey}
        />
      </div>

      {/* Display the current theme */}
      <div className="flex-1">
        <ThemeVotingDisplay theme={currentTheme}/>
      </div>

      {/* Bottom controls */}
      <div className="flex flex-col p-6 bg-text-secondary text-white gap-4">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={handlePrevious}
            className="px-4 py-2 rounded-md bg-text-secondary hover:bg-btn-hover-secondary"
          >
            ← Previous
          </button>

          <h2 className="text-lg font-semibold">
            {currentIndex + 1} / {unVotedThemes.length}
          </h2>

          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-md bg-text-secondary hover:bg-btn-hover-secondary"
          >
            Next →
          </button>
        </div>

        <div className="flex justify-center">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} // Just update state
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitVote(inputValue); // Only call function on Enter
                setInputValue("");
              }
            }}
            placeholder="Enter a number"
            className="px-4 py-2 rounded-md text-text-primary w-32 text-center"
          />
          <button
            onClick={endVoting}
            className="px-4 py-2 rounded-md bg-btn-hover-secondary hover:bg-text-secondary"
          >
            End voting
          </button>
        </div>
      </div>
    </div>
  );
}