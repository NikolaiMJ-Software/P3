import {useEffect, useState} from "react";
import logo from "../../assets/logo.png"
import {ThemeMovieCard} from "./MovieCard.jsx";
import DrinkingRuleCreator from "./DrinkingRuleCreator.jsx";
import {getMovieCount, getMoviePoster, searchMovies} from "../../services/movieService.jsx";
import ThemeCreatorTopcontent from "./ThemeCreatorTopcontent.jsx";
import ThemeMovieSearcher from "./ThemeMovieSearcher.jsx";
import ThemeCreator from "./ThemeCreator.jsx";
import {addTheme} from "../../services/themeService.jsx";
const MOVIE_LIMIT = 6;

export default function ThemeCreationPopup({isOpen, onClose}) {
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
        addTheme(title, sessionStorage.getItem("username"), movies, rules)
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
                <ThemeCreatorTopcontent handleClose={handleClose}></ThemeCreatorTopcontent>
                <div className={"flex flex-row"}>
                    {/* Left Movie searcher*/}
                    <ThemeMovieSearcher foundMovies={foundMovies}
                                        handleAddMovies={handleAddMovies}
                                        movieCount={movieCount}
                                        pageCount={pageCount}
                                        setPageCount={setPageCount}
                                        totalPageCount={totalPageCount}
                                        setSearchQuery={setSearchQuery}>
                    </ThemeMovieSearcher>
                    {/* Right Theme Creator */}
                    <ThemeCreator onSubmit={handleSubmit}
                                  movies={movies}
                                  handleRemoveMovie={handleRemoveMovie}>
                    </ThemeCreator>
                </div>
            </div>
        </div>
    )
}