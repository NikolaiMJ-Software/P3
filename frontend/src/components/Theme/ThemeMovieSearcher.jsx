import { useRef, useState } from "react";
export default function ThemeMovieSearcher({foundMovies, setSearchQuery, pageCount, setPageCount, totalPageCount, movieCount, handleAddMovies, sortBy, setSortBy, sortDirection, setSortDirection, movieFilter, setMovieFilter, seriesFilter, setSeriesFilter, shortsFilter, setShortsFilter, hideUnrated, setHideUnrated}){
    const searchInputRef = useRef();
const [dropdownOpen, setDropdownOpen] = useState(false);

function refresh() {
    setPageCount(1);
    setSearchQuery(q => q);
}

    return(
<div className="items-center relative flex-col flex gap-1 border-text-primary border-1 m-2 p-2 w-full h-[640px] overflow-visible">
            <div className="flex flex-row items-center gap-2 px-2 w-full whitespace-nowrap h-[50px] items-center overflow-visible">
                <input
                    ref={searchInputRef}
                    onKeyDown={event => event.key === "Enter" && (event.preventDefault(), setSearchQuery(event.target.value))}
                    type="text"
                    placeholder="Search Movie or Series..."
                    className="flex-1 min-w-[120px] text-center text-text-primary border-1 p-2 rounded-2xl truncate"
                />
                <button
                    onClick={(event) => setSearchQuery(searchInputRef.current.value)}
                    className="btn-primary"
                >
                    Search
                </button>

                
                <div className="relative z-50">
                <button
                    onClick={() => setDropdownOpen(o => !o)}
                    className="btn-primary"
                >
                    Filters ▾
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-black border-1 rounded-xl p-2 shadow-xl z-[9999]">
                        {/* Sort By */}
                        <p className="text-sm font-bold mb-1 text-text-primary">Sort by</p>
                        <div className={`cursor-pointer p-1 rounded 
                            ${sortBy === "rating" ? "bg-btn-hover-secondary font-bold" : "hover:bg-btn-hover-secondary"}`}
                            onClick={() => (setSortBy("rating"), refresh())}>
                            ⭐ Rating
                        </div>

                        <div className={`cursor-pointer p-1 rounded 
                            ${sortBy === "year" ? "bg-btn-hover-secondary font-bold" : "hover:bg-btn-hover-secondary"}`}
                            onClick={() => (setSortBy("year"), refresh())}>
                            📅 Year
                        </div>

                        <div className={`cursor-pointer p-1 rounded 
                            ${sortBy === "runtime" ? "bg-btn-hover-secondary font-bold" : "hover:bg-btn-hover-secondary"}`}
                            onClick={() => (setSortBy("runtime"), refresh())}>
                            ⏱ Runtime
                        </div>

                        <div className={`cursor-pointer p-1 rounded 
                            ${sortBy === "alphabetical" ? "bg-btn-hover-secondary font-bold" : "hover:bg-btn-hover-secondary"}`}
                            onClick={() => (setSortBy("alphabetical"), refresh())}>
                            🔤 A → Z
                        </div>

                        {/* Direction */}
                        <p className="text-sm font-bold mt-3 mb-1 text-text-primary">Direction</p>
                        <div className={`cursor-pointer p-1 rounded 
                            ${sortDirection === "asc" ? "bg-btn-hover-secondary font-bold" : "hover:bg-btn-hover-secondary"}`}
                            onClick={() => (setSortDirection("asc"), refresh())}>
                            Ascending ⬆
                        </div>

                        <div className={`cursor-pointer p-1 rounded 
                            ${sortDirection === "desc" ? "bg-btn-hover-secondary font-bold" : "hover:bg-btn-hover-secondary"}`}
                            onClick={() => (setSortDirection("desc"), refresh())}>
                            Descending ⬇
                        </div>

                        {/* Filters */}
                        <p className="text-sm font-bold mt-3 mb-1 text-text-primary">Types</p>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={movieFilter} onChange={(e) => (setMovieFilter(e.target.checked), refresh())}/>
                            Movies
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer mt-1">
                            <input type="checkbox" checked={seriesFilter} onChange={(e) => (setSeriesFilter(e.target.checked), refresh())}/>
                            Series
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer mt-1">
                            <input type="checkbox" checked={shortsFilter} onChange={(e) => (setShortsFilter(e.target.checked), refresh())}/>
                            Shorts
                        </label>

                        <p className="text-sm font-bold mt-3 mb-1 text-text-primary">Other Filters</p>
                        <label className="flex items-center gap-2 cursor-pointer mt-1">
                            <input
                                type="checkbox"
                                checked={hideUnrated}
                                onChange={(e) => (setHideUnrated(e.target.checked), refresh())}
                            />
                            Hide unrated
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
            <div className="absolute bottom-2 flex flex-row gap-4">
                <button onClick={() => setPageCount(prev => Math.max(1, prev - 1))} className="btn-primary">Prev</button>
                <p className="mt-3">{`${pageCount}/${totalPageCount}`}</p>
                <button onClick={() => setPageCount(prev => Math.min(totalPageCount, prev + 1))} className="btn-primary">Next</button>
                <p className="mt-3">{movieCount}</p>
            </div>
        </div>
    )
}

export function MovieSuggestion({movieName, year, runtime, posterURL, tConst, onAdd, isSeries, isShorts, rating}) {

    const runtimeHours = Math.floor(runtime / 60)
    const runtimeMinutesLeft = runtime % 60;
    const safeRating = (rating) ? "Rating: " + rating+"⭐" : "No Ratings Available";

    //different layout for shows, series and such.
    if(isSeries){
        return (
            <div onClick={onAdd} className="flex-row flex items-center gap-4 p-1 border-text-primary border-2 rounded-2xl w-full max-w-full h-20 cursor-pointer transform transition-all duration-200 hover:scale-[1.03]">
                <div className="w-[45px] h-[68px] overflow-hidden rounded-2xl flex-shrink-0">
                    <img src={posterURL} loading={"lazy"} alt={"Poster"} className={"h-full object-cover rounded-2xl flex-shrink-0"}/>
                </div>
                <div className={"flex flex-col max-w-[430px] overflow-hidden"}>
                    <a href={`https://www.imdb.com/title/${tConst}/`} target={"_blank"}>
                        <p className="font-bold truncate overflow-hidden text-ellipsis max-w-[423px] text-blue-400">{movieName} </p><p className={""}>{safeRating} - Series</p>
                    </a>

                    <p>{year}</p>
                </div>
                <button onClick={onAdd} className="btn-primary">
                    Add
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
                        <p className="font-bold truncate overflow-hidden text-ellipsis max-w-[423px] text-blue-400">{movieName} </p><p className={""}>{safeRating} - Shorts</p>
                    </a>

                    <p>{year}</p>
                </div>
                <button onClick={onAdd} className="btn-primary">
                    Add
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
                <p className={""}>{safeRating} -{" Runtime: " + runtimeHours + "h " + runtimeMinutesLeft + "m "}</p>
                <p>{year}</p>
                <p></p>

            </div>
            <button onClick={onAdd} className="btn-primary px-3 py-1 ml-auto">
                Add
            </button>
        </div>
    )
}