export default function ThemeVotingDisplay({ theme }) {
  if (!theme) return null;

  return (
    <div className="relative flex flex-col h-full bg-text-secondary text-btn-text p-6">
      {/* Theme name */}
      <h1 className="text-2xl font-semibold text-center mb-6">
        {theme.themeName}
      </h1>

      {/* Posters */}
      <div className="flex-1 flex flex-wrap justify-center gap-6">
        {theme.moviePosters?.length > 0 ? (
          theme.moviePosters.map((poster, idx) => (
            <img
              key={idx}
              src={poster}
              alt={theme.movieNames?.[idx] || `Poster ${idx}`}
              className="w-44 rounded-xl shadow-md"
            />
          ))
        ) : (
          <p>No posters found for this theme.</p>
        )}
      </div>

      {/* Drinking rules */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2 text-center">
          Drinking Rules
        </h2>
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
