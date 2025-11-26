import { useRef, useEffect } from "react";
export default function ThemeMovieSearcher({foundMovies, setSearchQuery, pageCount, setPageCount, totalPageCount, movieCount, handleAddMovies, sortBy, setSortBy, sortDirection, setSortDirection}){
    const searchInputRef = useRef();

    return(
        <div className={"items-center relative flex-col flex gap-1 border-text-primary border-1 m-2 p-2 w-full h-[640px] overflow-x-hidden overflow-y-hidden" }>
            <div className="flex flex-row items-center gap-2 px-2 w-full whitespace-nowrap h-[50px] items-center overflow-hidden">
                <input
                    ref={searchInputRef}
                    onKeyDown={event => event.key === "Enter" && (event.preventDefault(), setSearchQuery(event.target.value))}
                    type="text"
                    placeholder="Search Movie or Series..."
                    className="flex-1 min-w-[120px] text-center text-text-primary border-1 p-2 rounded-2xl truncate"
                />
                <button
                    onClick={(event) => setSearchQuery(searchInputRef.current.value)}
                    className="px-3 py-2 border-1 rounded-2xl hover:bg-btn-hover-secondary min-w-[80px] truncate"
                >
                    Search
                </button>
                <select
                    value={sortBy}
                    onChange={(e) => {
                        setSortBy(e.target.value);
                        setPageCount(1);      // reset page
                        setSearchQuery(q => q); // re-trigger fetch
                    }}
                    className="px-3 py-2 border-1 rounded-xl bg-bg-primary text-text-primary cursor-pointer hover:bg-btn-hover-secondary transition min-w-[110px] truncate"
                >
                    <option value="rating">⭐ Rating</option>
                    <option value="year">📅 Year</option>
                    <option value="runtime">⏱ Runtime</option>
                    <option value="alphabetical">🔤 A → Z</option>
                </select>

                <button
                    onClick={() => {
                        setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
                        setPageCount(1);
                        setSearchQuery(q => q); // retrigger fetch
                    }}
                    className="px-3 py-2 border-1 rounded-2xl hover:bg-btn-hover-secondary min-w-[60px] truncate">
                    {sortDirection === "asc" ? "⬆" : "⬇"}
                </button>
                </div>
            {foundMovies.map((movie) => {
                return <MovieSuggestion
                    movieName={movie.title}
                    year={movie.year}
                    posterURL={movie.moviePosterURL}
                    runtime={movie.runtimeMinutes}
                    tConst={movie.tConst}
                    onAdd={() => handleAddMovies(movie)}
                    isSeries={movie.isSeries}
                    rating={movie.rating}
                >
                </MovieSuggestion>
            })}
            <div className="absolute bottom-2 flex flex-row gap-4">
                <button onClick={() => setPageCount(prev => Math.max(1, prev - 1))} className="border-2 text-lg p-2 hover:cursor-pointer hover:bg-btn-hover-secondary">Prev</button>
                <p className="mt-3">{`${pageCount}/${totalPageCount}`}</p>
                <button onClick={() => setPageCount(prev => Math.min(totalPageCount, prev + 1))} className="border-2 text-lg p-2 hover:cursor-pointer hover:bg-btn-hover-secondary">Next</button>
                <p className="mt-3">{movieCount}</p>
            </div>
        </div>
    )
}

export function MovieSuggestion({movieName, year, runtime, posterURL, tConst, onAdd, isSeries, rating}) {

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
                <button onClick={onAdd} className="px-3 py-1 rounded-lg hover:bg-btn-hover-secondary cursor-pointer transition  ml-auto">
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
            <button onClick={onAdd} className="px-3 py-1 rounded-lg hover:bg-btn-hover-secondary cursor-pointer transition  ml-auto">
                Add
            </button>
        </div>
    )
}