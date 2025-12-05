import { useState, useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { fetchShuffledThemes, updateThemeVotes, deleteTheme, addWheelWinner } from "../services/themeService";
import { uploadEvent } from "../services/eventService";
import ThemeVotingDisplay from "../components/Theme/ThemeVotingDisplay";
import Timer from "../components/Timer";
import WheelOfFortune from "../components/WheelOfFortune.jsx";
import {isAdmin} from "../services/adminService.jsx"
import logo from "../assets/logo.png";

export default function ThemeVoting() {
  const [themes, setThemes] = useState([]);
  const [winningThemes, setWinningThemes] = useState([]);
  const [unVotedThemes, setUnVotedThemes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numberOfWinners, setNumberOfWinners] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [timerStart] = useState(60);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const [isVotingOngoing, setIsVotingOngoing] = useState(false);
  const [showWheelPopup, setShowWheelPopup] = useState(false);
  const [wheelNames, setWheelNames] = useState([]);
  const [runnerUpDetermined, setRunnerUpDetermined] = useState(false);
  const [runnerUpMeta, setRunnerUpMeta] = useState([]);
  const [runnerUpWinnerMovieId, setRunnerUpWinnerMovieId] = useState(null);
  const [runnerUpWinnerThemeId, setRunnerUpWinnerThemeId] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(undefined);
  const navigate = useNavigate();
  const {username} = useParams();

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

  // starts automatic start of finishing voting when conditions are met
  useEffect(() => {
    if ((isVotingOngoing === true && numberOfWinners > 0) || (runnerUpWinnerMovieId !== null)) {
      finishVoting();
    }
  }, [isVotingOngoing, runnerUpWinnerMovieId]);

  // Show wheel popup when there are names to spin for
  useEffect(() => {
    if (wheelNames.length > 0) {
        setShowWheelPopup(true);
    }
  }, [wheelNames]);

  // add keyboard navigation for themes when themes are loaded (page is fully loaded)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [[unVotedThemes.length]]);

  //check if {username} is admin
  useEffect(() => {
    async function checkAdmin() {
      const result = await isAdmin(username);
      setIsAdminUser(result);
    }
    checkAdmin();
  }, [username]);

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

  // Function that handles gathering data to end voting
  const endVoting = async () => {

    // If data has already been gathered to end voting, go to next function
    if (isVotingOngoing) {
      finishVoting();
      return;
    }

    // Check if all themes have been voted on
    const unvotedThemes = unVotedThemes.filter(
      (t) => t.votes === null || t.votes === undefined
    );
    if (unvotedThemes.length > 0) {
      alert("All themes must be voted for before ending voting!");
      return;
    }

    // Prompt for number of winners
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
      setIsVotingOngoing(true);
      return;
    }
  };

  // Function that finalizes voting, selects winners, and schedules events
  const finishVoting = async () => {

    // Creates 2 arrays: sorted (all unvoted themes sorted by votes) and winners (currently selected winning themes)
    let sorted = [...unVotedThemes].sort((a, b) => (b.votes || 0) - (a.votes || 0));
    let winners = [... winningThemes];

    // Continues to add themes to winningThemes until numberOfWinners is reached or a tie is detected
    while (winners.length < numberOfWinners) {
      console.log("Voting has found " + winners.length + " out of " + numberOfWinners + " winners so far.");

      // Get all themes with the current highest vote count
      const currentVotes = sorted[0].votes;
      const tiedThemes = sorted.filter(t => t.votes === currentVotes);
      const remainingSlots = numberOfWinners - winners.length;

      // Add them all if possible
      if (tiedThemes.length <= remainingSlots) {
        winners = [...winners, ...tiedThemes];
        sorted = sorted.filter(t => t.votes !== currentVotes);

        // Sets up the wheel spin for runner-up if all winners have been chosen
        if (winners.length === numberOfWinners && runnerUpDetermined === false) {
          const runnerUpThemes = sorted.filter(t => t.votes === sorted[0]?.votes);
          console.log("Runner-up themes:", runnerUpThemes);
          const runnerUpMovies = runnerUpThemes.flatMap(t => t.movieNames);

          // Create metadata for runner-up themes
          setRunnerUpMeta(runnerUpThemes.flatMap(theme =>
            theme.movieNames.map((title, index) => ({
              themeId: theme.themeId,
              movieId: theme.movieIds[index],
            }))
          ));

          setWheelNames(runnerUpMovies);
          setRunnerUpDetermined(true);
          setWinningThemes(winners);
          return;
        }

      // Trigger a tie-break if they cant all fit
      } else {
        console.log("Tie detected among themes:", tiedThemes);
        setUnVotedThemes(tiedThemes);
        setCurrentIndex(0);
        setWinningThemes(winners);
        alert("There is a tie among some themes. Please re-vote to break the tie.");
        return;
      }
    }

    // Finalize winners
    setWinningThemes(winners);

    // Prompt date for the first event
    const firstEvent = prompt("Set date of first event in yyyy-mm-dd format");
    if (!firstEvent || !/^\d{4}-\d{2}-\d{2}$/.test(firstEvent)) {
      alert("Please enter a valid date in yyyy-mm-dd format.");
      return;
    }
    const startDate = new Date(`${firstEvent}T16:30:00`);

    // Schedule events for each winner (2 weeks apart)
    for (let i = 0; i < winners.length; i++) {
      const eventDate = new Date(startDate);
      eventDate.setDate(startDate.getDate() + i * 14);
      const pad = (num) => String(num).padStart(2, "0");

      // Ensure the correct format is used for the backend
      const formattedDate =
        `${eventDate.getFullYear()}-` +
        `${pad(eventDate.getMonth() + 1)}-` +
        `${pad(eventDate.getDate())}T` +
        `${pad(eventDate.getHours())}:` +
        `${pad(eventDate.getMinutes())}:` +
        `00`;

      // Create events for winning themes
      try {
        const result = await uploadEvent(formattedDate, winners[i].themeId);
        console.log(`Event uploaded for ${formattedDate}:`, result);
      } catch (err) {
        console.error("Failed to upload event:", formattedDate, err);
      }
    }

    // Add the runner up winner to the current startup day
    try {
      const response = await addWheelWinner(runnerUpWinnerMovieId, runnerUpWinnerThemeId);
      console.log("Runner up registered: " + response);
    } catch (err) {
      console.log("Failed to add wheel winner" + err);
    }

    // Delete non-winning themes, and update database
    const runnerUpTheme = unVotedThemes.find(
      t => t.movieIds.includes(runnerUpWinnerMovieId)
    );
    console.log("Runner-up theme identified:", runnerUpTheme);
    await deleteAllThemesExcept([...winners, runnerUpTheme]);
    await updateWinningThemes([...winners, runnerUpTheme]);
    alert("Voting concluded and events scheduled!");
    window.open("/admin/events", "_self");
  };

  // Update the votes on the database to fit local votes
  const updateWinningThemes = async (winners) => {
    try {
      for (let i=0; i < winners.length; i++) {
        const theme = winners[i];
        await updateThemeVotes(theme.themeId, theme.votes, true);
      }
    } catch (err) {
      console.error("Failed to update winning themes:", err);
    }
  }

  // Delete all themes from Database except matching input
  const deleteAllThemesExcept = async (keptThemes) => {
    try {

      // Sort winning themes from themes to be deleted
      const winningIds = keptThemes.map(t => Number(t.themeId));
      const toDelete = themes.filter(t => !winningIds.includes(Number(t.themeId)));
      if (toDelete.length === 0) {
        console.log("No themes to delete.");
        return { deleted: [], failed: [] };
      }

      // Set up arrays to store completion data
      const deleted = [];
      const failed = [];

      // Delete every theme in toDelete from backend
      for (const t of toDelete) {
        const id = Number(t.themeId);
        try {
          await deleteTheme(id); 
          deleted.push(id);
          console.log(`Deleted theme with ID: ${id}`);
        } catch (err) {
          console.error(`Failed to delete theme with ID: ${id}`, err);
          failed.push({ id, err });
        }
      }

      // Update client side to fit new backend
      setThemes(prev => prev.filter(t => !deleted.includes(Number(t.themeId))));
      setUnVotedThemes(prev => prev.filter(t => !deleted.includes(Number(t.themeId))));

      return { deleted, failed };
    } catch (err) {
      console.error("Unexpected error in deleteAllThemesExcept:", err);
      return { deleted: [], failed: [{ err }] };
    }
  };

  // Set runner up winner based on wheel result
  const handleWheelResult = (value, index) => {
    setTimeout( async () => {
      setShowWheelPopup(false);
      setRunnerUpWinnerThemeId(runnerUpMeta[index].themeId)
      setRunnerUpWinnerMovieId(runnerUpMeta[index].movieId);
    }, 2000);
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

  // Reset the timer
  const resetTimer = () => {
    // Increment a dummy value to update timer which resets value
    setTimerResetKey((prev) => prev + 1);
  };
  
  // HTML of theme voting page
  if (unVotedThemes.length === 0) return <p>Loading themes...</p>;
  const currentTheme = unVotedThemes[currentIndex];
  if(isAdminUser === 1){
    return (
      <div className="flex flex-col w-full">

        {/* Display the current theme, timer, and back button*/}
        <div className="relative">
          <ThemeVotingDisplay theme={currentTheme}/>
          <div className="absolute top-4 right-0">
            <div className="scale-70 bg-black/70 text-primary px-3 py-2 rounded-lg shadow-lg">
              <Timer initialSeconds={timerStart} resetKey={timerResetKey} />
            </div>
          </div>
          <div className="absolute top-6 left-7">
            <button
              onClick={() => navigate(`/admin/${username}`)} class="btn-secondary">
              <img src={logo} alt="Back to Admin" className="size-7"/>
            </button>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex flex-col px-6">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={handlePrevious}
              class="btn-secondary">
              ← Previous
            </button>

            {/* Theme counter */}
            <h2 className="text-lg font-semibold">
              {currentIndex + 1} / {unVotedThemes.length}
            </h2>

            <button
              onClick={handleNext}
              class="btn-secondary">
              Next →
            </button>
          </div>

          {/* Input field for votes */}
          <div className="flex justify-center">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submitVote(inputValue);
                  setInputValue("");
                }
              }}
              placeholder="Enter a number"
              className="px-4 py-2 rounded-md text-text-primary w-32 text-center"
            />
            <button
              onClick={endVoting}
              className="px-4 py-2 rounded-md bg-btn-hover-secondary hover:bg-text-secondary">
              End voting
            </button>
          </div>
        </div>

        {/* Wheel of fortune popup to decide winning runner up */}
        {showWheelPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <p className="absolute top-8 text-white text-xl">Spin the Wheel to determine which movie to watch today!</p>
            <div className="bg-primary rounded-lg p-6 shadow-lg w-1/2 max-w-4xl relative">

              {/* Close button */}
              <button
                onClick={() => setShowWheelPopup(false)}
                className="absolute top-4 right-4 text-black text-xl font-bold">
                ×
              </button>

              {/* Imported wheel of fortune component */}
              <WheelOfFortune inputs={wheelNames} onResult={handleWheelResult}/>
            </div>
          </div>
        )}
      </div>
    );

  // If user is not admin, navigate away from page
  } else if (isAdminUser === 0){
    return(navigate(`/${username}`))
  }
}