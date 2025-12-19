import {useRef} from "react";
export default function EventThemeSearcher({ foundThemes, setSearchQuery, pageCount, setPageCount, totalPageCount, handleAddThemes }){
    const searchInputRef = useRef();
    return(
        <div className="items-center relative flex-col flex gap-1 border-text-primary border-1 m-2 p-2 w-full h-[640px] overflow-visible">
            {/* Searching */}
            <div className="flex flex-row items-center gap-2 px-2 w-full whitespace-nowrap h-[50px] items-center overflow-visible">
                <input
                    ref={searchInputRef}
                    onKeyDown={event => event.key === "Enter" && (event.preventDefault(), setSearchQuery(event.target.value))}
                    type="text"
                    placeholder="Search by theme name or user..."
                    className="flex-1 min-w-[120px] text-center text-text-primary border-1 p-2 rounded-2xl truncate"
                />
                <button
                    onClick={() => setSearchQuery(searchInputRef.current.value)}
                    className="btn-primary"
                >
                    Search
                </button>
            </div>
            {/* Show the found themes */}
            {foundThemes.map((theme) => {

                return <EventTheme
                    themeName={theme.name}
                    tConsts={theme.tConsts}
                    onAdd={() => handleAddThemes(theme)}
                    user={theme.username}
                    moviePosterUrl={theme.movies[0].moviePosterURL}
                >
                </EventTheme>
            })}
            <div className="absolute bottom-2 flex flex-row gap-4">
                <button onClick={() => setPageCount(prev => Math.max(1, prev - 1))} className="btn-primary">Prev</button>
                <p className="mt-3">{`${pageCount}/${totalPageCount}`}</p>
                <button onClick={() => setPageCount(prev => Math.min(totalPageCount, prev + 1))} className="btn-primary">Next</button>
            </div>
        </div>
    )
}

// Standardized component to show the themes
export function EventTheme({ themeName, onAdd, user, moviePosterUrl }) {
    return(
        <div onClick={onAdd} className={"flex-row flex items-center gap-4 p-1 border-text-primary border-2 rounded-2xl w-full max-w-full h-20 cursor-pointer transform transition-all duration-200 hover:scale-[1.03]"}>
            {/* Poster */}
            <div className="w-[45px] h-[68px] overflow-hidden rounded-2xl flex-shrink-0">
                <img src={moviePosterUrl} loading={"lazy"} alt={"Poster"} className={"h-full object-cover rounded-2xl flex-shrink-0"}/>
            </div>
            {/* Theme name, username, etc. */}
            <div className={"flex flex-col max-w-[430px] overflow-hidden h-full"}>
                <p className="font-bold truncate overflow-hidden text-ellipsis max-w-[350px]">{themeName}</p>
                <p> {user} </p>
            </div>
            {/* Add button */}
            <button onClick={onAdd} className="btn-primary px-3 py-1 ml-auto">
                Add
            </button>
        </div>
    )
}