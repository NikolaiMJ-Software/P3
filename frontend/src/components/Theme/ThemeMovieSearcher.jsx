import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ThemeMovieSearcher({foundMovies, setSearchQuery, pageCount, setPageCount, totalPageCount, movieCount, handleAddMovies, sortBy, setSortBy, sortDirection, setSortDirection, movieFilter, setMovieFilter, seriesFilter, setSeriesFilter, shortsFilter, setShortsFilter, hideUnrated, setHideUnrated}){
    const searchInputRef = useRef();
    const {t} = useTranslation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
function refresh() {
    setPageCount(1);
    setSearchQuery(q => q);
}

    return(
<div className="items-center relative flex-col flex gap-1 border-text-primary border-1 m-2 p-2 w-full h-[640px] overflow-visible">
            <div className="flex flex-row items-center gap-2 px-2 w-full whitespace-nowrap h-[50px] items-center overflow-visible">
                <input
                    ref={searchInputRef}
                    onKeyDown={event => event.key === "Enter" && (event.preventDefault(), setHasSearched(true), setSearchQuery(event.target.value))}
                    type="text"
                    placeholder= {t("CreateThemeSearch")}
                    className="flex-1 min-w-[120px] text-center text-text-primary border-1 p-2 rounded-2xl truncate"
                />
                <button
                    onClick={(event) => {setHasSearched(true), setSearchQuery(searchInputRef.current.value)}}
                    className="btn-primary"
                >
                    {t("search")}
                </button>

                
                <div className="relative z-50">
                <button
                    onClick={() => setDropdownOpen(o => !o)}
                    className="btn-primary"
                >
                    {t("themeFilters")}
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-black border-1 rounded-xl p-2 shadow-xl z-[9999]">
                        {/* Sort By */}
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

                        {/* Filters */}
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

            {hasSearched && movieCount === 0 && (
                <div className="text-text-primary text-center mt-4 max-w-[400px] mx-auto break-words">
                <p>{t("no results found")} <br/>"<span className="font-bold">{searchInputRef.current?.value}</span>"</p>
                
                <p><br/>{t("please make sure")}</p>
            </div>
            )}

            <div className="absolute bottom-2 flex flex-row gap-4">
                <button onClick={() => setPageCount(prev => Math.max(1, prev - 1))} className="btn-primary">{t("previous")}</button>
                <p className="mt-3">{`${pageCount}/${totalPageCount}`}</p>
                <button onClick={() => setPageCount(prev => Math.min(totalPageCount, prev + 1))} className="btn-primary">{t("next")}</button>
                <p className="mt-3">{movieCount}</p>
            </div>
        </div>
    )
}

export function MovieSuggestion({movieName, year, runtime, posterURL, tConst, onAdd, isSeries, isShorts, rating}) {
    const {t} = useTranslation();
    const runtimeHours = Math.floor(runtime / 60)
    const runtimeMinutesLeft = runtime % 60;
    const safeRating = (rating) ? t("rating: ") + rating+"⭐" : t("no ratings available");

    //different layout for shows, series and such.
    if(isSeries){
        return (
            <div onClick={onAdd} className="flex-row flex items-center gap-4 p-1 border-text-primary border-2 rounded-2xl w-full max-w-full h-20 cursor-pointer transform transition-all duration-200 hover:scale-[1.03]">
                <div className="w-[45px] h-[68px] overflow-hidden rounded-2xl flex-shrink-0">
                    <img src={posterURL} loading={"lazy"} alt={"Poster"} className={"h-full object-cover rounded-2xl flex-shrink-0"}/>
                </div>
                <div className={"flex flex-col max-w-[430px] overflow-hidden"}>
                    <a href={`https://www.imdb.com/title/${tConst}/`} target={"_blank"}>
                        <p className="font-bold truncate overflow-hidden text-ellipsis max-w-[423px] text-blue-400">{movieName} </p><p className={""}>{safeRating} - {t("series")}</p>
                    </a>

                    <p>{year}</p>
                </div>
                <button onClick={onAdd} className="btn-primary px-3 py-1 ml-auto">
                    {t("add")}
                </button>
            </div>
        )
    }

    if(isShorts){
        return (
            <div onClick={onAdd} className="flex-row flex items-center gap-4 p-1 border-text-primary border-2 rounded-2xl w-full max-w-full h-20 cursor-pointer transform transition-all duration-200 hover:scale-[1.03]">
                <div className="w-[45px] h-[68px] overflow-hidden rounded-2xl flex-shrink-0">
                    <img src={posterURL} loading={"lazy"} alt={"Poster"} className={"h-full object-cover rounded-2xl flex-shrink-0"}/>
                </div>
                <div className={"flex flex-col max-w-[430px] overflow-hidden"}>
                    <a href={`https://www.imdb.com/title/${tConst}/`} target={"_blank"}>
                        <p className="font-bold truncate overflow-hidden text-ellipsis max-w-[423px] text-blue-400">{movieName} </p><p className={""}>{safeRating} - {t("shorts")}</p>
                    </a>

                    <p>{year}</p>
                </div>
                <button onClick={onAdd} className="btn-primary px-3 py-1 ml-auto">
                    {t("add")}
                </button>
            </div>
        )
    }

    return(
        <div onClick={onAdd} className={"flex-row flex items-center gap-4 p-1 border-text-primary border-2 rounded-2xl w-full max-w-full h-20 cursor-pointer transform transition-all duration-200 hover:scale-[1.03]"}>
            <div className="w-[45px] h-[68px] overflow-hidden rounded-2xl flex-shrink-0">
                <img src={posterURL} loading={"lazy"} alt={"Poster"} className={"h-full object-cover rounded-2xl flex-shrink-0"}/>
            </div>

            <div className={"flex flex-col max-w-[430px] overflow-hidden"}>
                <a href={`https://www.imdb.com/title/${tConst}/`} target={"_blank"}>
                    <p className="font-bold truncate overflow-hidden text-ellipsis max-w-[350px] text-blue-400">{movieName}</p>
                </a>
                <p className={""}>{safeRating} - {t("runtime") + " " +runtimeHours + t("timehour") + runtimeMinutesLeft + "m "}</p>
                <p>{year}</p>
                <p></p>

            </div>
            <button onClick={onAdd} className="btn-primary px-3 py-1 ml-auto">
                {t("add")}
            </button>
        </div>
    )
}