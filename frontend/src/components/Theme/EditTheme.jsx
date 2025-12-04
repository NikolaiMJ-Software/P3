import { useEffect, useState } from "react";
import ThemeCreator from "./ThemeCreator.jsx";
import ThemeMovieSearcher from "./ThemeMovieSearcher.jsx";
import { getMoviesByTconsts, getMovieCount, searchMovies, getMoviePoster } from "../../services/movieService.jsx";
import {useTranslation} from "react-i18next";
import { updateTheme } from "../../services/themeService.jsx";

const MOVIE_LIMIT = 6;

export default function EditTheme({ theme, onClose }) {
  const [title, setTitle] = useState(theme?.name || "");
  const [movies, setMovies] = useState([]);
  const [rules, setRules] = useState(Array.isArray(theme?.drinkingRules) ? theme.drinkingRules : []);
  const [pageCount, setPageCount] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [foundMovies, setFoundMovies] = useState([]);
  const [movieCount, setMovieCount] = useState(0);
  const [sortBy, setSortBy] = useState("rating");
  const [sortDirection, setSortDirection] = useState("desc"); // "asc" | "desc"
  const [movieFilter, setMovieFilter] = useState(true);
  const [seriesFilter, setSeriesFilter] = useState(false);
  const [shortsFilter, setShortsFilter] = useState(false);
  const [hideUnrated, setHideUnrated] = useState(false);
  const {t} = useTranslation();

  const extractTconst = (input) => {
      if (!input) return null;
      const match = input.match(/tt\d{7,8}/i);
      return match ? match[0] : null;
  };

  // collect theme movie data based on tConst
useEffect(() => {
  if (!theme?.tConsts || !theme.tConsts.length) return;
  (async () => {
    try {
      const initialMovies = await getMoviesByTconsts(theme.tConsts);
      const moviesWithTconst = initialMovies.map((m, i) => ({
        ...m,
        tConst: theme.tConsts[i], 
      }));

      setMovies(moviesWithTconst);
    } catch (e) {
      console.error("Error fetching movies for edit popup:", e);
    }
  })();
}, [theme]);

  // Yeeted ThemeCreationPopup search logic
  useEffect(() => {
    const fetchData = async () => {
      if (!searchQuery || searchQuery.trim() === "") {
        setPageCount(1);
        setTotalPageCount(1);
        setFoundMovies([]);
        setMovieCount(0);
        return;
      }
      // Detect full IMDb link or raw tt1234567
      const tconst = extractTconst(searchQuery);
      if (tconst) {
          // its direct tconst search so its always at page 1 with limit 1 since its exact
          try {
              const movies = await searchMovies(tconst, 1, 1, sortBy, sortDirection, movieFilter, seriesFilter, shortsFilter, hideUnrated);
              setFoundMovies(movies);
              setMovieCount(movies.length);
              setTotalPageCount(1);
          } catch (e) {
              console.error("IMDb link search failed:", e);
              setFoundMovies([]);
              setMovieCount(0);
              setTotalPageCount(1);
          }
          return;
        }
      try {
        setPageCount(1);

        const count = await getMovieCount(searchQuery);
        setMovieCount(count);
        setTotalPageCount(Math.ceil(count / MOVIE_LIMIT));

        const movies = await searchMovies(searchQuery, 1, MOVIE_LIMIT, sortBy, sortDirection, movieFilter, seriesFilter, shortsFilter, hideUnrated);
        setFoundMovies(movies);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFoundMovies([]);
      }
    };
    fetchData();
  }, [searchQuery, sortBy, sortDirection, movieFilter, seriesFilter, shortsFilter, hideUnrated]);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim() === "") return;
    const tconst = extractTconst(searchQuery);
    if (tconst) return; 
    const switchPage = async () => {
      try {
        const movies = await searchMovies(searchQuery, pageCount, MOVIE_LIMIT, sortBy, sortDirection, movieFilter, seriesFilter,shortsFilter, hideUnrated);
        setFoundMovies(movies);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFoundMovies([]);
      }
    };
    switchPage();
  }, [pageCount, searchQuery, sortBy, sortDirection, movieFilter, seriesFilter, shortsFilter, hideUnrated]);

  useEffect(() => {
    const fetchMissingPosters = async () => {
      const moviesWithoutPoster = foundMovies.filter((m) => !m.moviePosterURL);
      if (moviesWithoutPoster.length === 0) return;

      await Promise.all(
        moviesWithoutPoster.map(async (movie) => {
          try {
            const posterURL = await getMoviePoster(movie.tConst);
            setFoundMovies((prev) =>
              prev.map((m) =>
                m.tConst === movie.tConst ? { ...m, moviePosterURL: posterURL } : m
              )
            );
          } catch (error) {
            console.error("Error fetching poster", error);
          }
        })
      );
    };
    fetchMissingPosters();
  }, [foundMovies]);

  // Add/remove movies from the edited theme
  const handleAddMovies = (movie) => {
    setMovies((prev) => {
      if (prev.some((m) => m.tConst === movie.tConst)) return prev;
      return [...prev, movie];
    });
  };

  const handleRemoveMovie = (tConst) => {
    setMovies((prev) => prev.filter((m) => m.tConst !== tConst));
  };

  // update function for themes
  const handleUpdate = async () => {
    if (!title.trim()) {
        alert("Please enter a theme title");
        return;
    }

    if (!movies.length) {
        alert("Please add at least one movie");
        return;
    }

    try {
        await updateTheme(
            theme.themeId,               // id for /api/themes/{id}
            title,                       // name
            movies.map(m => m.tConst),   // tConsts
            rules                        // drinkingRules
        );

        alert("Theme updated successfully!");
        onClose && onClose();
    } catch (error) {
        console.error("Error updating theme:", error);
        alert("Failed to update theme: " + error);
    }
  };

  return (
    <div className="p-1 sm:p-10 relative flex justify-center items-center">
      <div className="bg-primary drop-shadow-xl w-full max-w-full h-fit border-2 border-text-primary rounded-3xl p-3 sm:p-8 flex flex-col sm:gap-3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{t("editTheme")}</h2>
          <button
            className="px-3 py-1 rounded-lg hover:bg-btn-hover-secondary cursor-pointer text-text-error"
            onClick={onClose}
          >
            X
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 w-full sm:overflow-hidden">
          {/* Left: Movie search */}
          <div className="flex-1 sm:min-w-[400px] sm:max-w-[600px] sm:h-[700px]">
            <ThemeMovieSearcher
              foundMovies={foundMovies}
              handleAddMovies={handleAddMovies}
              movieCount={movieCount}
              pageCount={pageCount}
              setPageCount={setPageCount}
              totalPageCount={totalPageCount}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              movieFilter={movieFilter}
              setMovieFilter={setMovieFilter}
              seriesFilter={seriesFilter}
              setSeriesFilter={setSeriesFilter}
              shortsFilter={shortsFilter}
              setShortsFilter={setShortsFilter}
              hideUnrated={hideUnrated}
              setHideUnrated={setHideUnrated}
            />
          </div>

          {/* Right: Theme editor */}
          <div className="flex-1 sm:min-w-[400px] sm:max-w-[600px] sm:h-[700px] overflow-y-auto">
            <ThemeCreator
              handleSubmit={handleUpdate}   
              movies={movies}
              handleRemoveMovie={handleRemoveMovie}
              setTitle={setTitle}
              title={title}
              rules={rules}
              setRules={setRules}
            />
          </div>
        </div>

        <div className="w-full flex justify-center mt-3">
          <button
            onClick={handleUpdate}
            className="btn-primary"
          >
            {t("update")}
          </button>
        </div>
      </div>
    </div>
  );
}
