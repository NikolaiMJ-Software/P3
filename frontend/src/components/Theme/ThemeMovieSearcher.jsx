import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * ThemeMovieSearcher
 * Handles searching movies, applying filters/sorting, and paginating results
 * for theme creation.
 */
export default function ThemeMovieSearcher({foundMovies, setSearchQuery, pageCount, setPageCount, totalPageCount, movieCount, handleAddMovies, sortBy, setSortBy, sortDirection, setSortDirection, movieFilter, setMovieFilter, seriesFilter, setSeriesFilter, shortsFilter, setShortsFilter, hideUnrated, setHideUnrated}){
    const searchInputRef = useRef();
    const {t} = useTranslation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
// Resets pagination and re-triggers the current search
function refresh() {
    setPageCount(1);
    setSearchQuery(q => q); // Forces re-fetch without changing query
}
const dropdownRef = useRef(null);

// Close filter when clicking outside
useEffect(() => {
    function handleInteraction(event) {
        // Close on outside click
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }

        // Close on Escape key
        if (event.key === "Escape") {
            setDropdownOpen(false);
        }
    }

    document.addEventListener("mousedown", handleInteraction);
    document.addEventListener("keydown", handleInteraction);

    return () => {
        document.removeEventListener("mousedown", handleInteraction);
        document.removeEventListener("keydown", handleInteraction);
    };
}, []);


    return(
<div className="bg-primary drop-shadow-xl items-center relative flex-col flex gap-1 border-text-primary border-1 sm:m-2 p-2 w-full h-[600px] sm:h-[640px] overflow-visible">
            {/* Search bar and buttons */}
            <div className="flex flex-row items-center gap-2 sm:px-2 w-full whitespace-nowrap sm:h-[50px] items-center overflow-visible">
                <input
                    ref={searchInputRef}
                    onKeyDown={event => event.key === "Enter" && (event.preventDefault(), setHasSearched(true), setSearchQuery(event.target.value))}
                    type="text"
                    placeholder= {t("CreateThemeSearch")}
                    className="bg-primary drop-shadow-lg flex-1 sm:min-w-[120px] text-center text-text-primary border-1 p-1 sm:p-2 rounded-2xl truncate"
                />
                {/* Search button (hidden on mobile) */}
                <div className="hidden sm:flex">
                    <button
                        onClick={(event) => {setHasSearched(true), setSearchQuery(searchInputRef.current.value)}}
                        className="btn-primary"
                    >
                        {t("search")}
                    </button>
                </div>

                {/* Filter dropdown */}                
                <div className="relative z-50" ref={dropdownRef}>
                <button
                    onClick={() => setDropdownOpen(o => !o)}
                    className="btn-primary"
                >
                    {t("themeFilters")}
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-primary text-black border-1 rounded-xl p-2 shadow-xl z-[9999]">

                        {/* Sorting options */}
                        <p className="text-sm font-bold mb-1 text-text-primary">{t("sort by")}</p>
                        
                        <div className={`cursor-pointer p-1 rounded 
                            ${sortBy === "rating" ? "bg-btn-hover-secondary font-bold" : "hover:bg-btn-hover-secondary"}`}
                            onClick={() => (setSortBy("rating"), refresh())}>
                            ⭐ {t("rating")}
                        </div>

                        <div className={`cursor-pointer p-1 rounded 
                            ${sortBy === "year" ? "bg-btn-hover-secondary font-bold" : "hover:bg-btn-hover-secondary"}`}
                            onClick={() => (setSortBy("year"), refresh())}>
                            📅 {t("year")}
                        </div>

                        <div className={`cursor-pointer p-1 rounded 
                            ${sortBy === "runtime" ? "bg-btn-hover-secondary font-bold" : "hover:bg-btn-hover-secondary"}`}
                            onClick={() => (setSortBy("runtime"), refresh())}>
                            ⏱ {t("runtime")}
                        </div>

                        <div className={`cursor-pointer p-1 rounded 
                            ${sortBy === "alphabetical" ? "bg-btn-hover-secondary font-bold" : "hover:bg-btn-hover-secondary"}`}
                            onClick={() => (setSortBy("alphabetical"), refresh())}>
                            🔤 {t("alphabet")}
                        </div>

                        {/* Direction */}
                        <p className="text-sm font-bold mt-3 mb-1 text-text-primary">{t("direction")}</p>
                        <div className={`cursor-pointer p-1 rounded 
                            ${sortDirection === "asc" ? "bg-btn-hover-secondary font-bold" : "hover:bg-btn-hover-secondary"}`}
                            onClick={() => (setSortDirection("asc"), refresh())}>
                            {t("ascending")}
                        </div>

                        <div className={`cursor-pointer p-1 rounded 
                            ${sortDirection === "desc" ? "bg-btn-hover-secondary font-bold" : "hover:bg-btn-hover-secondary"}`}
                            onClick={() => (setSortDirection("desc"), refresh())}>
                            {t("descending")}
                        </div>

                        {/* Type filters */}
                        <p className="text-sm font-bold mt-3 mb-1 text-text-primary">{t("types")}</p>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={movieFilter} onChange={(e) => (setMovieFilter(e.target.checked), refresh())}/>
                            {t("movies")}
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer mt-1">
                            <input type="checkbox" checked={seriesFilter} onChange={(e) => (setSeriesFilter(e.target.checked), refresh())}/>
                            {t("series")}
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer mt-1">
                            <input type="checkbox" checked={shortsFilter} onChange={(e) => (setShortsFilter(e.target.checked), refresh())}/>
                            {t("shorts")}
                        </label>

                        <p className="text-sm font-bold mt-3 mb-1 text-text-primary">{t("other filters")}</p>
                        <label className="flex items-center gap-2 cursor-pointer mt-1">
                            <input
                                type="checkbox"
                                checked={hideUnrated}
                                onChange={(e) => (setHideUnrated(e.target.checked), refresh())}
                            />
                            {t("hide unrated")}
                        </label>
                    </div>
                )}
            </div>

            </div>
            {/* Movie results */}
            {foundMovies.map((movie) => {
                console.log("MOVIE:", movie);
                return <MovieSuggestion
                    movieName={movie.title}
                    year={movie.year}
                    posterURL={movie.moviePosterURL}
                    runtime={movie.runtimeMinutes}
                    tConst={movie.tConst}
                    onAdd={() => handleAddMovies(movie)}
                    isSeries={movie.isSeries}
                    isShorts={movie.isShorts}
                    rating={movie.rating}
                >
                </MovieSuggestion>
            })}
            {/* No results message */}
            {hasSearched && movieCount === 0 && (
                <div className="text-text-primary text-sm sm:text-base text-center mt-4 max-w-[400px] mx-auto break-words">
                <p>{t("no results found")} <br/>"<span className="font-bold">{searchInputRef.current?.value}</span>"</p>
                
                <p><br/>{t("please make sure")}</p>
            </div>
            )}

            {/* Pagination */}
            <div className="absolute bottom-2 flex flex-row gap-2 sm:gap-4">
                <button onClick={() => setPageCount(prev => Math.max(1, prev - 1))} className="btn-primary">{t("previous")}</button>
                <p className="mt-3">{`${pageCount}/${totalPageCount}`}</p>
                <button onClick={() => setPageCount(prev => Math.min(totalPageCount, prev + 1))} className="btn-primary">{t("next")}</button>
                <p className="mt-3">{movieCount}</p>
            </div>
        </div>
    )
}
// Displays movie, series, or short suggestion
export function MovieSuggestion({movieName, year, runtime, posterURL, tConst, onAdd, isSeries, isShorts, rating}) {
    const {t} = useTranslation();
    // Convert runtime to hours and minutes
    const runtimeHours = Math.floor(runtime / 60)
    const runtimeMinutesLeft = runtime % 60;
    // Fallback text if no rating exists
    const safeRating = (rating) ? t("rating: ") + rating+"⭐" : t("no ratings available");

    // Series layout
    if(isSeries){
        return (
            <div onClick={onAdd} className="bg-primary drop-shadow-lg flex-row flex items-center gap-2 sm:gap-4 p-1 border-text-primary border-2 rounded-2xl w-full max-w-full h-20 cursor-pointer transform transition-all duration-200 hover:scale-[1.03]">
                <div className="w-[45px] h-[68px] overflow-hidden rounded-2xl flex-shrink-0">
                    <img src={posterURL} loading={"lazy"} alt={"Poster"} className={"h-full object-cover rounded-2xl flex-shrink-0"}/>
                </div>
                <div className="flex flex-col max-w-[430px] overflow-hidden justify-between h-full py-0.5">
                    <a href={`https://www.imdb.com/title/${tConst}/`} target={"_blank"}>
                        <p className="font-bold truncate overflow-hidden text-sm sm:text-base text-ellipsis max-w-[423px] text-blue-400">{movieName} </p>
                        <div className="text-xs sm:text-base">
                            {`${safeRating} - ${t("series")}`}
                        </div>
                    </a>

                    <p className="text-xs sm:text-base">{year}</p>
                </div>
                <button onClick={onAdd} className="btn-primary px-3 py-1 ml-auto">
                    {t("add")}
                </button>
            </div>
        )
    }
    // Shorts layout
    if(isShorts){
        return (
            <div onClick={onAdd} className="bg-primary drop-shadow-lg flex-row flex items-center gap-2 sm:gap-4 p-1 border-text-primary border-2 rounded-2xl w-full max-w-full h-20 cursor-pointer transform transition-all duration-200 hover:scale-[1.03]">
                <div className="w-[45px] h-[68px] overflow-hidden rounded-2xl flex-shrink-0">
                    <img src={posterURL} loading={"lazy"} alt={"Poster"} className={"h-full object-cover rounded-2xl flex-shrink-0"}/>
                </div>
                <div className={"flex flex-col max-w-[430px] overflow-hidden"}>
                    <a href={`https://www.imdb.com/title/${tConst}/`} target={"_blank"}>
                        <p className="font-bold truncate overflow-hidden text-sm sm:text-base text-ellipsis max-w-[423px] text-blue-400">{movieName} </p>
                        <div className="text-xs sm:text-base">
                            {`${safeRating} - ${t("shorts")}`}
                        </div>
                    </a>

                    <p className="text-xs sm:text-base">{year}</p>
                </div>
                <button onClick={onAdd} className="btn-primary px-3 py-1 ml-auto">
                    {t("add")}
                </button>
            </div>
        )
    }
    // Default movie layout
    return(
        <div onClick={onAdd} className={"bg-primary drop-shadow-lg flex-row flex items-center gap-2 sm:gap-4 p-1 border-text-primary border-2 rounded-2xl w-full max-w-full h-20 cursor-pointer transform transition-all duration-200 hover:scale-[1.03]"}>
            <div className="w-[45px] h-[68px] overflow-hidden rounded-2xl flex-shrink-0">
                <img src={posterURL} loading={"lazy"} alt={"Poster"} className={"h-full object-cover rounded-2xl flex-shrink-0"}/>
            </div>

            <div className={"flex flex-col max-w-[430px] overflow-hidden"}>
                <a href={`https://www.imdb.com/title/${tConst}/`} target={"_blank"}>
                    <p className="font-bold truncate overflow-hidden text-sm sm:text-base text-ellipsis max-w-[350px] text-blue-400">{movieName}</p>
                </a>
                <div className="text-xs sm:text-base leading-[1.1]">
                    {safeRating} – {t("runtime")} {runtimeHours}{t("timehour")} {runtimeMinutesLeft}m
                </div>

                <p className="text-xs sm:text-base">{year}</p>
                <p></p>

            </div>
            <button onClick={onAdd} className="btn-primary px-3 py-1 ml-auto">
                {t("add")}
            </button>
        </div>
    )
}