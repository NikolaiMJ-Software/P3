import React, {useEffect, useState} from "react";
import logo from "../../assets/logo.png"
import {ThemeMovieCard} from "./MovieCard.jsx";
import DrinkingRuleCreator from "./DrinkingRuleCreator.jsx";
import {getMovieCount, getMoviePoster, searchMovies} from "../../services/movieService.jsx";
import ThemeCreatorTopcontent from "./ThemeCreatorTopcontent.jsx";
import ThemeMovieSearcher from "./ThemeMovieSearcher.jsx";
import ThemeCreator from "./ThemeCreator.jsx";
import {addTheme, getThemes} from "../../services/themeService.jsx";
import ThemeBrowser from "./ThemeBrowser.jsx";
import { useTranslation } from "react-i18next";
const MOVIE_LIMIT = 6;


/**
 * ThemeCreationPopup
 * Main container for theme creation:
 * - Lets user search movies (left panel)
 * - Lets user build a theme (right panel)
 * - Submits theme to backend
*/
export default function ThemeCreationPopup({setSelected}) {
    const [title, setTitle] = useState("");
    const [movies, setMovies] = useState([]);
    const [rules, setRules] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [totalPageCount, setTotalPageCount] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [foundMovies, setFoundMovies] = useState([]);
    const [movieCount, setMovieCount] = useState(0);

    // Sorting / filtering controls (passed into ThemeMovieSearcher)
    const [sortBy, setSortBy] = useState("rating");
    const [sortDirection, setSortDirection] = useState("desc"); // "asc" | "desc"
    const [movieFilter, setMovieFilter] = useState(true);
    const [seriesFilter, setSeriesFilter] = useState(false);
    const [shortsFilter, setShortsFilter] = useState(false);
    const [hideUnrated, setHideUnrated] = useState(false);
    const {t} = useTranslation();

    // Fetch results when query or filters change
    useEffect(() => {
        const fetchData = async () => {
            if (!searchQuery || searchQuery.trim() === ""){
            setPageCount(1);
            setTotalPageCount(1);
            setFoundMovies([]);
            setMovieCount(0);
            return;
            }

        // Detect full IMDb link or raw tConst searches
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
            setPageCount(1); //page reset

            // Get total result count for pagination
            const count = await getMovieCount(searchQuery)
            setMovieCount(count);
            setTotalPageCount(Math.ceil(count / MOVIE_LIMIT));

            //fetch first page
            const movies = await searchMovies(searchQuery, 1, MOVIE_LIMIT, sortBy, sortDirection, movieFilter, seriesFilter, shortsFilter, hideUnrated)
            setFoundMovies(movies);
        } catch (error){
            console.error("Error fetching data:", error);
            setFoundMovies([]);
        }
        }
        fetchData();
    }, [searchQuery, sortBy, sortDirection, movieFilter, seriesFilter, shortsFilter, hideUnrated]);

    // Fetch next/prev page
    useEffect(() => {
        if (!searchQuery || searchQuery.trim() === "") return;
            const tconst = extractTconst(searchQuery);
            if (tconst) return; 

            const switchPage = async () => {
                try {
                    const movies = await searchMovies(searchQuery, pageCount, MOVIE_LIMIT, sortBy, sortDirection, movieFilter, seriesFilter, shortsFilter, hideUnrated)
                    setFoundMovies(movies);
                }catch (error){
                    console.error("Error fetching data:",error);
                    setFoundMovies([])
                }
        }
        switchPage();
    }, [pageCount, sortBy, sortDirection, movieFilter, seriesFilter, shortsFilter, hideUnrated]);

    // Fetch missing poster URLs for search results
    useEffect(() => {
        const fetchMissingPosters = async () => {
            const moviesWithoutPoster = foundMovies.filter(m => !m.moviePosterURL);
            if (moviesWithoutPoster === 0) return;

            await Promise.all(
                moviesWithoutPoster.map(async (movie)=>{
                    try {
                        const posterURL = await getMoviePoster(movie.tConst);
                        setFoundMovies(prev => prev.map(m => m.tConst === movie.tConst ? {...m, moviePosterURL: posterURL} : m));
                    }catch (error){
                        console.error("Error fetching poster", error);
                    }
                })
            )
        }
        fetchMissingPosters();
    }, [foundMovies]);

    // Validate input and submit theme
    const handleSubmit = async () => {
        if(!title){
            alert("Please enter theme title");
            return;
        }
        if(movies.length === 0) {
            alert("Please add at least one movie");
            return;
        }
        try {
            const username = sessionStorage.getItem("username")
            const drinkingRules = rules || "";
            console.log("Sending theme:", { title, username, movies, drinkingRules });
            await addTheme(title, username, movies.map(movie => movie.tConst), drinkingRules);
            setSelected("themes")

        } catch (error) {
            console.error("Error creating theme:", error);
            alert("failed to create theme" + error);
        }
    }

    // Add movie to theme (avoid duplicates)
    const handleAddMovies = (movie) => {
        setMovies(prev =>{
            if (prev.some(m => m.tConst === movie.tConst)) return prev;
            return [...prev, movie];
        })
    }

    // Remove movie from theme
    const handleRemoveMovie = (tConst) => {
    setMovies(prev => prev.filter(m => m.tConst !== tConst));
    };

    // Reset theme creation state
    const resetForm = () => {
        setTitle("");
        setMovies([]);
        setRules("");
    }
    
    // Extract IMDb tConst from input (link or raw)
    const extractTconst = (input) => {
        if (!input) return null;

        const match = input.match(/tt\d{7,8}/i);
        return match ? match[0] : null;
    };

    return (
        <div className="p-1 sm:p-10 relative flex justify-center items-center">
            <div className="bg-primary drop-shadow-xl w-full max-w-full h-fit border-2 border-text-primary rounded-3xl p-3 sm:p-8 flex flex-col sm:gap-3">

                {/* Top content */}
                <div className={"flex flex-col sm:flex-row gap-2 sm:gap-10 w-full justify-center"}>
                    {/* Left Movie searcher*/}
                    <div className="flex-1 sm:min-w-[400px] sm:max-w-[600px] sm:h-[700px]">
                    <ThemeMovieSearcher foundMovies={foundMovies}
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
                                        setHideUnrated={setHideUnrated}>
                    </ThemeMovieSearcher>
                    </div>
                    {/* Right Theme Creator */}
                    <div className="flex-1 sm:min-w-[400px] sm:max-w-[600px] sm:h-[700px] overflow-y-auto">
                    <ThemeCreator
                        handleSubmit={handleSubmit}
                        movies={movies}
                        handleRemoveMovie={handleRemoveMovie}
                        setTitle={setTitle}
                        rules={rules}
                        setRules={setRules}
                    >
                    </ThemeCreator>
                    </div>

                </div>
                <div className="w-full flex justify-center mt-3">
                    <button
                        onClick={handleSubmit}
                        className="btn-primary"
                    >
                        {t("submit")}
                    </button>
                </div>
            </div>
        </div>
    )
}