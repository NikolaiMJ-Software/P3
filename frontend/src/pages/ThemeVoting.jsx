import { useState, useEffect } from "react";
import { fetchShuffledThemes } from "../services/themeService";

export default function ThemeVoting() {
  const [themes, setThemes] = useState([]);

  // Get list of shuffled themes
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

  // HTML of the page
  return (
    <div>
      <h1>Theme Voting</h1>
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
