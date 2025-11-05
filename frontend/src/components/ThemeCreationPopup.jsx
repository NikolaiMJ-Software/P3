import {useEffect, useState} from "react";
import logo from "../assets/logo.png"
import {ThemeMovieCard} from "./MovieCard.jsx";
import DrinkingRuleCreator from "./DrinkingRuleCreator.jsx";
import {getMovieCount, getMoviePoster, searchMovies} from "../services/movieService.jsx";
const MOVIE_LIMIT = 6;

export default function ThemeCreationPopup({isOpen, onClose, onSubmit, userId}) {
    const [title, setTitle] = useState("");
    const [movies, setMovies] = useState([]);
    const [rules, setRules] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [totalPageCount, setTotalPageCount] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [foundMovies, setFoundMovies] = useState([]);
    const [movieCount, setMovieCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!searchQuery || searchQuery.trim() === ""){
            setPageCount(1);
            setTotalPageCount(1);
            setFoundMovies([]);
            setMovieCount(0);
            return;
            }

        try {
            setPageCount(1); //page reset

            //calculate how many pages of movies there are.
            const count = await getMovieCount(searchQuery)
            setMovieCount(count);
            setTotalPageCount(Math.ceil(count / MOVIE_LIMIT));

            //fetch first page
            const movies = await searchMovies(searchQuery, 1, MOVIE_LIMIT)
            setFoundMovies(movies);
        } catch (error){
            console.error("Error fetching data:", error);
            setFoundMovies([]);
        }
        }
        fetchData();
    }, [searchQuery]);

    useEffect(() => {
        if (!searchQuery || searchQuery.trim() === "") return;
            const switchPage = async () => {
                try {
                    const movies = await searchMovies(searchQuery, pageCount, MOVIE_LIMIT)
                    setFoundMovies(movies);
                }catch (error){
                    console.error("Error fetching data:",error);
                    setFoundMovies([])
                }
        }
        switchPage();
    }, [pageCount]);

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

    const convertLinkToTconst = (link) =>{
        const parts = link.split("/");
        return parts.find(p => p.startsWith("tt")) || null;
    }

    const handleSubmit = () => {
        if(!title){
            alert("Please enter theme title");
            return;
        }
        if(movies.length === 0) {
            alert("Please add at least one movie");
            return;
        }
        onSubmit({
            title,
            movies,
            rules: rules.trim() || null,
            userId,
        });

        resetForm();
        onClose();
    };

    const handleAddMovies = (movie) => {
        setMovies(prev =>{
            if (prev.some(m => m.tConst === movie.tConst)) return prev;
            return [...prev, movie];
        })

    }

    const handleRemoveMovie = (tConst) => {
    setMovies(prev => prev.filter(m => m.tConst !== tConst));
    };

    const resetForm = () => {
        setTitle("");
        setMovies([]);
        setRules("");
    }
    const handleClose = () => {
        resetForm();
        onClose();
    };





    if (!isOpen) {
        return null;
    }
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
            <div className="relative bg-white rounded-2xl p-6 shadow-lg w-[1200px] h-200">
                {/* Top content */}
                <h2 className={"text-2xl font-semibold mb-4 text-center items-center"}>Create new theme</h2>
                <img src={logo}
                     alt="logo"
                     className="absolute top-3 left-3 w-15 h-15 object-contain"/>
                <button onClick={handleClose} className={" absolute top-3 right-3 text-5xl"}>X</button>

                <div className={"flex flex-row"}>
                    {/* Left Movie searcher*/}
                    <div className={"items-center relative flex-col flex gap-1 border-black border-1 m-2 p-2 w-[600px] h-[640px]" }>
                        <div className={"flex flex-row"}>
                            <input onKeyDown={event => event.key === "Enter" && (event.preventDefault(), setSearchQuery(event.target.value))} type="text" placeholder="Search Movie or enter IMDb link..." className="w-100 text-center text-black border-1 m-2 p-2 rounded-2xl overflow-y-auto overflow-x-hidden max-h-[200px]" />
                            <button onClick={event => setSearchQuery(event.target.previousSibling.value)} className="text-center text-black border-1 m-2 p-2 rounded-2xl overflow-y-auto overflow-x-hidden hover:cursor-pointer hover:bg-gray-300">Search</button>
                        </div>
                        {foundMovies.map((movie) => {
                            return <MovieSuggestion movieName={movie.title} year={movie.year} posterURL={movie.moviePosterURL} runtime={movie.runtimeMinutes} tConst={movie.tConst} onAdd={() => handleAddMovies(movie)}></MovieSuggestion>
                        })}
                        <div className="absolute bottom-4 flex flex-row gap-4">
                            <button onClick={() => setPageCount(prev => Math.max(1, prev - 1))} className="border-2 text-lg p-2 hover:cursor-pointer hover:bg-gray-500">Prev</button>
                            <p className="mt-3">{`${pageCount}/${totalPageCount}`}</p>
                            <button onClick={() => setPageCount(prev => Math.min(totalPageCount, prev + 1))} className="border-2 text-lg p-2 hover:cursor-pointer hover:bg-gray-500">Next</button>
                            <p className="mt-3">{movieCount}</p>
                        </div>
                    </div>
                    {/* Right Theme Creator */}
                    <div className={"items-center flex-col flex gap-1 border-1 m-2 p-2 w-[600px]"}>
                        <input type={"text"} placeholder={"Enter theme title"} className={"w-100 text-center text-black border-1 m-2 p-2 rounded-2xl"}/>
                        <button
                            onClick={onSubmit}
                            className={"absolute bottom-4 left-1/2 transform -translate-x-1/2 font-semibold px-8 py-3 rounded-xl border-2 border-black hover:bg-gray-300"}>Confirm
                        </button>
                        <p className={"text-center"}>Movies</p>
                        <div className={"w-full max-w-[500px] overflow-x-auto overflow-y-hidden gap-"}>
                            <div className={"flex flex-row gap-4 items-center"}>
                                {movies.map(m =>{
                                    return<ThemeMovieCard title={m.title} runtimeMinutes={m.runtimeMinutes} moviePosterURL={m.moviePosterURL} onRemove={() => handleRemoveMovie(m.tConst)}></ThemeMovieCard>
                                })}
                                
                            </div>
                        </div>
                        <DrinkingRuleCreator></DrinkingRuleCreator>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function MovieSuggestion({movieName, year, runtime, posterURL, tConst, onAdd}) {

    const runtimeHours = Math.floor(runtime / 60)
    const runtimeMinutesLeft = runtime % 60;

    return(
        <div className={"flex-row flex items-center gap-4 p-1 border-black border-2 rounded-2xl w-135 h-20"}>
            <div className="w-[45px] h-[68px] overflow-hidden rounded-2xl flex-shrink-0">
                <img src={posterURL} loading={"lazy"} alt={"Poster"} className={"h-full object-cover rounded-2xl flex-shrink-0"}/>
            </div>

            <div className={"flex flex-col"}>
                <a href={`https://www.imdb.com/title/${tConst}/`} target={"_blank"}>
                    <p className="font-bold truncate max-w-[370px] text-blue-400 ">{movieName}</p>
                </a>
                <p>{year}</p>
                <p>{runtimeHours + "h " + runtimeMinutesLeft + "m "}</p>

            </div>
            <button onClick={onAdd} className="px-3 py-1 rounded-lg hover:bg-gray-300 cursor-pointer transition  ml-auto">
                Add
            </button>
        </div>
    )
}