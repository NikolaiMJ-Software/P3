import { useState, useEffect } from "react";
import { fetchShuffledThemes } from "../services/themeService";
import { getMoviePoster } from "../services/movieService";

export default function ThemeVoting() {
  const [themes, setThemes] = useState([]);

  // Get all theme data
  useEffect(() => {
    async function loadThemes() {
      try {
        const data = await fetchShuffledThemes();

        // For each theme, fetch all its movie posters
        const themesWithPosters = await Promise.all(
          data.map(async (theme) => {
            if (!theme.movieIds || theme.movieIds.length === 0) {
              return { ...theme, posters: [] };
            }
            const posters = await Promise.all(
              theme.movieIds.map(async (tConst) => {
                try {
                  const posterUrl = await getMoviePoster(tConst);
                  return posterUrl;
                } catch {
                  return null; // fallback if a single poster fails
                }
              })
            );

            return { ...theme, posters: posters.filter(Boolean) };
          })
        );

        setThemes(themesWithPosters);
      } catch (err) {
        // Error something here
      }
    }
    loadThemes();
  }, []);

  // HTML of the page
  return (
    <div style={{ padding: "1rem" }}>
      <h1>Theme Voting</h1>

      {themes.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {themes.map((theme, index) => (
            <li
              key={index}
              style={{
                marginBottom: "2rem",
                borderBottom: "1px solid #ccc",
                paddingBottom: "1rem",
              }}
            >
              <h2>{theme.name}</h2>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {theme.posters.length > 0 ? (
                  theme.posters.map((poster, idx) => (
                    <img
                      key={idx}
                      src={poster}
                      alt={`Poster for ${theme.name}`}
                      style={{
                        width: "180px",
                        borderRadius: "10px",
                        objectFit: "cover",
                      }}
                    />
                  ))
                ) : (
                  <p>No posters available</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading themes...</p>
      )}
    </div>
  );
}