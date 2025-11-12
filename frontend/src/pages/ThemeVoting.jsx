import { useState, useEffect } from "react";
import { fetchShuffledThemes, updateThemeVotes } from "../services/themeService";
import { getMoviePosterById } from "../services/movieService";
import { uploadEvent } from "../services/eventService";
import ThemeVotingDisplay from "../components/Theme/ThemeVotingDisplay";

export default function ThemeVoting() {
  const [themes, setThemes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [votesArray, setVotesArray] = useState([]);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    async function loadThemes() {
      try {

        // Fetch all shuffled themes
        const themesData = await fetchShuffledThemes();

        // Add the posters for each movie
        const posterThemes = await Promise.all(
          themesData.map(async (theme) => {
            const movieIds = theme.movieIds || [];

            // Fetch posters for each movie ID
            const posters = await Promise.all(
              movieIds.map(async (id) => {
                try {
                  const posterUrl = await getMoviePosterById(id);
                  return posterUrl;
                } catch (err) {
                  console.warn(`Failed to fetch poster for movie ${id}`, err);
                  return null;
                }
              })
            );

            // Append posters to theme object
            return {
              ...theme,
              posters: posters.filter(Boolean), // remove any nulls
            };
          })
        );

        setThemes(posterThemes);
      } catch (error) {
        console.error("Error loading themes:", error);
      }
    }

    loadThemes();
  }, []);

const submitVote = async (votes) => {
    if (votes === "") {
      alert("Please enter an amount of votes");
      return;
    }

    const themeId = themes[currentIndex].themeId;

    try {
      const result = await updateThemeVotes(themeId, votes);
      alert(result);

      // Update votesArray for frontend tracking
      setVotesArray((prevVotes) => {
        const existing = prevVotes.find((v) => v.themeId === themeId);
        if (existing) {
          return prevVotes.map((v) =>
            v.themeId === themeId ? { ...v, votes: Number(votes) } : v
          );
        }
        return [...prevVotes, { themeId, votes: Number(votes) }];
      });

      setInputValue("");
    } catch (err) {
      alert("Failed to update votes");
    }
  };

  const endVoting = () => {

    // Input validation
    if (votesArray.length === 0) {
      alert("No votes recorded yet!");
      return;
    }
    const numberOfWinners = parseInt(
      prompt("How many themes are allowed to win?"),
      10
    );
    if (isNaN(numberOfWinners) || numberOfWinners <= 0) {
      alert("Please enter a valid positive number.");
      return;
    }

    // Sort and select n winners
    const sorted = [...votesArray].sort((a, b) => b.votes - a.votes);
    const topThemes = sorted.slice(0, numberOfWinners);
    setWinners(topThemes);

    // Add every winner to database
    winners.forEach(async (winner) => {
    });
  };

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % themes.length);
  const handlePrevious = () =>
    setCurrentIndex((prev) => (prev === 0 ? themes.length - 1 : prev - 1));

  if (themes.length === 0) return <p>Loading themes...</p>;

  const currentTheme = themes[currentIndex];

return (
    <div className="flex flex-col h-screen">
      {/* Display the current theme */}
      <div className="flex-1">
        <ThemeVotingDisplay theme={currentTheme} />
      </div>

      {/* Bottom controls */}
      <div className="flex flex-col p-6 bg-gray-900 text-white gap-4">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={handlePrevious}
            className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600"
          >
            ← Previous
          </button>

          <h2 className="text-lg font-semibold">
            {currentIndex + 1} / {themes.length}
          </h2>

          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600"
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
            className="px-4 py-2 rounded-md text-black w-32 text-center"
          />
          <button
            onClick={endVoting}
            className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600"
          >
            End voting
          </button>
        </div>
      </div>
    </div>
  );
}