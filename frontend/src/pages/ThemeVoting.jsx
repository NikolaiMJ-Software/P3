import { useState, useEffect } from "react";
import { fetchShuffledThemes } from "../services/themeService";

export default function ThemeVoting() {
  const [themes, setThemes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadThemes() {
      try {
        const data = await fetchShuffledThemes();
        setThemes(data);
      } catch (err) {
        setError("Failed to load themes");
      }
    }

    loadThemes();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Theme Voting</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {themes.length > 0 ? (
        <ul>
          {themes.map((theme, index) => (
            <li key={index}>{theme.name}</li>
          ))}
        </ul>
      ) : (
        <p>Loading themes...</p>
      )}
    </div>
  );
}
