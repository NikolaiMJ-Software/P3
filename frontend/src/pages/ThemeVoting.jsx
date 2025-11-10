import { useState, useEffect } from "react";
import { fetchShuffledThemes } from "../services/themeService";
import { getMoviePosterById } from "../services/movieService";

export default function ThemeVoting() {
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    async function loadThemes() {
      try {

        // Fetch all shuffled themes
        const themesData = await fetchShuffledThemes();

        // Add the posters for each movie
        const enrichedThemes = await Promise.all(
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

            // 3️⃣ Append posters to theme object
            return {
              ...theme,
              posters: posters.filter(Boolean), // remove any nulls
            };
          })
        );

        setThemes(enrichedThemes);
      } catch (error) {
        console.error("Error loading themes:", error);
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