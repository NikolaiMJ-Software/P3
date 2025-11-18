import {useEffect, useState} from "react";
import logo from "../../assets/logo.png"
import {ThemeMovieCard} from "./MovieCard.jsx";
import DrinkingRuleCreator from "./DrinkingRuleCreator.jsx";
import {getMovieCount, getMoviePoster, searchMovies} from "../../services/movieService.jsx";
import ThemeCreatorTopcontent from "./ThemeCreatorTopcontent.jsx";
import ThemeMovieSearcher from "./ThemeMovieSearcher.jsx";
import ThemeCreator from "./ThemeCreator.jsx";
import {addTheme, getThemes} from "../../services/themeService.jsx";
const MOVIE_LIMIT = 6;

export default function ThemeCreationPopup() {
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
            
            alert("Theme created sucessfully! ");
        } catch (error) {
            console.error("Error creating theme:", error);
            alert("failed to create theme" + error);
        }
    }

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


    return (
        <div className="p-10 relative">
            <div className="w-full max-w-full h-fit border-2 border-text-primary rounded-3xl p-8 flex flex-col gap-3">

                {/* Top content */}
                <div className={"flex flex-row gap-6 w-full overflow-hidden"}>
                    {/* Left Movie searcher*/}
                    <div className="w-[600px] h-[650px]">
                    <ThemeMovieSearcher foundMovies={foundMovies}
                                        handleAddMovies={handleAddMovies}
                                        movieCount={movieCount}
                                        pageCount={pageCount}
                                        setPageCount={setPageCount}
                                        totalPageCount={totalPageCount}
                                        setSearchQuery={setSearchQuery}>
                    </ThemeMovieSearcher>
                    </div>
                    {/* Right Theme Creator */}
                    <div className="w-[600px] h-[650px]">
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
                <div className="w-full flex justify-center mt-6">
                <button
                    onClick={handleSubmit}
                    className="px-7 py-3 rounded-xl border-2 border-text-primary hover:bg-btn-hover-secondary"
                >
                    Submit
                </button>
            </div>
            </div>
        </div>
    )
}