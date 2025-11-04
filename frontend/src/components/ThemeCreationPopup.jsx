import { useState } from "react";
import logo from "../assets/logo.png"
import MovieCard, {ThemeMovieCard} from "./MovieCard.jsx";
import DrinkingRuleCreator from "./DrinkingRuleCreator.jsx";

export default function ThemeCreationPopup({isOpen, onClose, onSubmit, userId}) {
    const [title, setTitle] = useState("");
    const [movies, setMovies] = useState([]);
    const [rules, setRules] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [totalPageCount, setTotalPageCount] = useState(1);

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
                            <input type={"text"} placeholder={"Search Movie or enter iMDB link..."} className={"w-100 text-center text-black border-1 m-2 p-2 rounded-2xl overflow-y-auto overflow-x-hidden max-h-[200px]"}/>
                            <button className={"text-center text-black border-1 m-2 p-2 rounded-2xl overflow-y-auto overflow-x-hidden hover:cursor-pointer hover:bg-gray-300"}>Search</button>
                        </div>
                        <MovieSuggestion movieName={"Pirates of the Carribean"} posterURL={"https://m.media-amazon.com/images/M/MV5BMTcwODc1MTMxM15BMl5BanBnXkFtZTYwMDg1NzY3._V1_FMjpg_UX1000_.jpg"} year={"2004"} runtime={"140"}></MovieSuggestion>
                        <MovieSuggestion movieName={"Pirates of the Carribean"} posterURL={"https://m.media-amazon.com/images/M/MV5BMTcwODc1MTMxM15BMl5BanBnXkFtZTYwMDg1NzY3._V1_FMjpg_UX1000_.jpg"} year={"2004"} runtime={"140"}></MovieSuggestion>
                        <MovieSuggestion movieName={"Pirates of the Carribean"} posterURL={"https://m.media-amazon.com/images/M/MV5BMTcwODc1MTMxM15BMl5BanBnXkFtZTYwMDg1NzY3._V1_FMjpg_UX1000_.jpg"} year={"2004"} runtime={"140"}></MovieSuggestion>
                        <MovieSuggestion movieName={"Pirates of the Carribean"} posterURL={"https://m.media-amazon.com/images/M/MV5BMTcwODc1MTMxM15BMl5BanBnXkFtZTYwMDg1NzY3._V1_FMjpg_UX1000_.jpg"} year={"2004"} runtime={"140"}></MovieSuggestion>
                        <MovieSuggestion movieName={"Pirates of the Carribean"} posterURL={"https://m.media-amazon.com/images/M/MV5BMTcwODc1MTMxM15BMl5BanBnXkFtZTYwMDg1NzY3._V1_FMjpg_UX1000_.jpg"} year={"2004"} runtime={"140"}></MovieSuggestion>
                        <MovieSuggestion movieName={"langt movie navn som virkelig tager meget plads på siden"} posterURL={"https://i1.sndcdn.com/artworks-uGJeJgu2YvAOEq59-vwTFWQ-t500x500.jpg"} year={"2004"} runtime={"140"}></MovieSuggestion>
                        <div className={"absolute bottom-4 flex flex-row gap-4"}>
                            <button className={"border-2 text-lg p-2 hover:cursor-pointer hover:bg-gray-500"}>
                                <p>prev</p>
                            </button>
                            <p className={"mt-3"}>{`${pageCount}/${totalPageCount}`}</p>
                            <button className={"border-2 p-3 hover:cursor-pointer hover:bg-gray-500"}>
                                <p>Next</p>
                            </button>
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
                        <div className={"w-full max-w-[500px] h-70 overflow-x-auto overflow-y-hidden gap-"}>
                            <div className={"flex flex-row gap-4 items-center"}>
                                {movies.map((movie) => {
                                    return <ThemeMovieCard title={movie.title}></ThemeMovieCard>
                                })}
                                <ThemeMovieCard cl title={"Pirates of the Carribean"} year={"2004"} moviePosterURL={"https://m.media-amazon.com/images/M/MV5BMTcwODc1MTMxM15BMl5BanBnXkFtZTYwMDg1NzY3._V1_FMjpg_UX1000_.jpg"} runtimeMinutes={140}></ThemeMovieCard>
                                <ThemeMovieCard title={"Pirates of the Carribean"} year={"2004"} moviePosterURL={"https://m.media-amazon.com/images/M/MV5BMTcwODc1MTMxM15BMl5BanBnXkFtZTYwMDg1NzY3._V1_FMjpg_UX1000_.jpg"} runtimeMinutes={140}></ThemeMovieCard>
                            </div>
                            {movies.runtime}
                        </div>
                        <DrinkingRuleCreator></DrinkingRuleCreator>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function MovieSuggestion({movieName, year, runtime, posterURL}) {

    const runtimeHours = Math.floor(runtime / 60)
    const runtimeMinutesLeft = runtime % 60;

    return(
        <div className={"flex-row flex items-center gap-4 p-1 border-black border-2 rounded-2xl w-135 h-20"}>
            <img src={posterURL} loading={"lazy"} alt={"Poster"} className={"h-full object-cover rounded-2xl"}/>
            <div className={"flex flex-col"}>
                <p className="font-bold truncate max-w-[370px]">{movieName}</p>
                <p>{year}</p>
                <p>{runtimeHours + "h " + runtimeMinutesLeft + "m "}</p>

            </div>
            <button className="px-3 py-1 rounded-lg hover:bg-gray-300 cursor-pointer transition  ml-auto">
                Add
            </button>
        </div>
    )
}