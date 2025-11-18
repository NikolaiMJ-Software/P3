
export default function ThemeMovieSearcher({foundMovies, setSearchQuery, pageCount, setPageCount, totalPageCount, movieCount, handleAddMovies}){

    return(
        <div className={"items-center relative flex-col flex gap-1 border-text-primary border-1 m-2 p-2 w-full h-[640px] overflow-hidden" }>
            <div className={"flex flex-row"}>
                <input onKeyDown={event => event.key === "Enter" && (event.preventDefault(), setSearchQuery(event.target.value))} type="text" placeholder="Search Movie or enter IMDb link..." className="w-100 text-center text-text-primary border-1 m-2 p-2 rounded-2xl overflow-y-auto overflow-x-hidden max-h-[200px]" />
                <button onClick={event => setSearchQuery(event.target.previousSibling.value)} className="text-center text-text-primary border-1 m-2 p-2 rounded-2xl overflow-y-auto overflow-x-hidden hover:cursor-pointer hover:bg-btn-hover-secondary">Search</button>
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
    const safeRating = (rating) ? "Rating: " + rating : "No Ratings Available";

    //different layout for shows, series and such.
    if(isSeries){
        return (
            <div className={"flex-row flex items-center gap-4 p-1 border-text-primary border-2 rounded-2xl w-full max-w-full0"}>
                <div className="w-[45px] h-[68px] overflow-hidden rounded-2xl flex-shrink-0">
                    <img src={posterURL} loading={"lazy"} alt={"Poster"} className={"h-full object-cover rounded-2xl flex-shrink-0"}/>
                </div>
                <div className={"flex flex-col"}>
                    <a href={`https://www.imdb.com/title/${tConst}/`} target={"_blank"}>
                        <p className="font-bold truncate overflow-hidden text-ellipsis max-w-[350px] text-blue-400">{movieName} </p><p className={""}>{safeRating} - Series</p>
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

            <div className={"flex flex-col"}>
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