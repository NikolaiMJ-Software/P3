import film_tape from '../../assets/film_tape.jpg';

export default function ThemeVotingDisplay({ theme }) {
  if (!theme) return null;

  function formatRunTime(minutes) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) {
      return `${mins.toString()}m`;
    }
    else {
      return `${hrs.toString()}h ${mins.toString().padStart(2, '0')}m`;
    }
  }

  return (
    <div className="w-full p-6 flex flex-col items-center gap-1">
      {/* Film tape top */}
      <div className="w-full h-12"
        style={{backgroundImage: `url(${film_tape})`,
        backgroundRepeat: "repeat-x",
        backgroundSize: "contain"}}> 
      </div>
     
      {/* Theme title + submitter */}
      <div className="w-3/4 p-4 rounded-xl text-center shadow-inner border py-0">
        <h1 className="text-l font-bold">{theme.themeName}</h1>
        <p className="text-xs mt-1">Submitted by: {theme.submitterName}</p>
      </div>

      {/* Movie posters row */}
      <div className="flex gap-6 w-full justify-center mt-4">
        {[...Array(theme.movieNames.slice(0,4).length)].map((_, i) => (
          <div key={i} className="flex flex-col items-center w-74 p-2 rounded-xl shadow py-0">
            <div className="w-full h-102 rounded-md bg-center bg-cover" style={{backgroundImage: `url(${theme.moviePosters[i]})`}}></div>
            <p className="text-xs mt-2">{formatRunTime(theme.runTimes[i])}</p>
            <p className="mt-1">{theme.ratings[i]}/10⭐</p>
          </div>
        ))}
        {theme.movieNames.length > 4 && (
          <div className="flex items-center">
            <div className="p-4 rounded-lg">And {theme.movieNames.length - 4} more...</div>
          </div>
        )}
      </div>


      {/* Drinking rules */}
      <div className="w-3/4 p-4 rounded-xl border py-0 text-center mt-4">
        <p>
          {theme.drinkingRules.length > 0
            ? theme.drinkingRules.join(", ")
            : "No drinking rules."}
        </p>
      </div>


      {/* Film strip bottom */}
      <div
        className="relative w-full h-12 mt-4 flex items-center justify-center"
        style={{
          backgroundImage: `url(${film_tape})`,
          backgroundRepeat: "repeat-x",
          backgroundSize: "contain"
        }}
      >
        <div className="bg-black/60 text-primary px-4 py-0 rounded-lg shadow">
          <p className="text-xl font-bold">
            Total Runtime: {formatRunTime(theme.runTimes.reduce((a, b) => a + b, 0))}
          </p>
        </div>
      </div>


      {/* Show current votes */}
      <div className="w-3/4 p-4 rounded-xl text-center py-0">
        <h2 className="text-xl font-bold mb-2">Current Votes: {theme.votes}</h2>
      </div>

    </div>
  );
}