import MovieCard, {MovieCardSmall} from "./MovieCard.jsx";
import {useEffect, useState} from "react";
import {getMovies, getMoviesByTconsts} from "../services/movieService.jsx";

export default function ThemeCard({title, name, tConsts, drinkingRules}){
    const [movies, setMovies] = useState([]);

    const moviesToShow = Array.isArray(movies) ? movies.slice(0, 2) : [];
    useEffect(() => {
        getMoviesByTconsts(tConsts).then(setMovies);
    }, []);

    return(
        <div className={"relative w-60 h-80 border-2 border-black rounded-xl p-3 flex flex-col justify-between text-lg font-medium shadow-sm hover:shadow-md transition shrink-0 bg-white" +
            "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>
            <div>
                <h1 className={"text-xl font-bold"}>{title}</h1>
                <h2 className={"text-sm text-gray-600"}>{name}</h2>
                <h3 className={"mt-2 font-semibold text-sm"}>Drinking Rules:</h3>
                <ul className={"text-xs list-disc list-inside"}>{drinkingRules.map((rule) => {return (<li key={rule}>{rule}</li>)})}</ul>
            </div>

            <div className={"flex justify-between gap-2 mt-3"}>
                {/*movies.slice(0,2).map((movie) => (
                    <MovieCardSmall key={movie.id} title={movie.title} moviePosterURL={movie.moviePosterURL} runtimeMinutes={movie.runtimeMinutes}/>
                ))*/}
            </div>
        </div>
    )
}
export function ThemeCardSmall({title, name, tConsts}){
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        getMoviesByTconsts(tConsts).then(setMovies);
    }, []);

    return(
        <div className={"w-60 h-80 border-2 border-black" +
            "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>
            <h1>{title}</h1>
            <h2>{name}</h2>
            {movies.map((movie, i) =>{
                return <MovieCardSmall
                    key={movie.i}
                    title={movie.title}
                    moviePosterURL={movie.moviePosterURL}
                    runtimeMinutes={movie.runtimeMinutes}
                ></MovieCardSmall>
            })}
        </div>
    )
}
export function ThemeCreationCard({onClick}){

    return(
        <div onClick={onClick} className={"relative w-60 h-80 border-2 border-black rounded-xl p-3 flex flex-col justify-center items-center cursor-pointer text-lg font-medium shadow-sm hover:shadow-md transition shrink-0 bg-white" +
            "text-lg font-medium shadow-sm hover:bg-green-100 transition shrink-0"}>
            <p className={"mb-4 text-center"}>Create Theme</p>
            <div className={"bg-green-200 flex justify-center items-center w-16 h-16 border-5 border-green-500 rounded-full"}>
                <span className="text-5xl font-bold text-green-500 mb-2.5">+</span>
            </div>
        </div>
    )
}

export function StartupCard({date}){
    return(
        <div onClick={onClick} className={"relative w-60 h-80 border-2 border-black rounded-xl p-3 flex flex-col justify-center items-center cursor-pointer text-lg font-medium shadow-sm hover:shadow-md transition shrink-0 bg-white" +
            "text-lg font-medium shadow-sm hover:bg-green-100 transition shrink-0"}>
            <p className={"mb-4 text-center"}>Startup Day</p>
            <p className={"mb-4 text-center"}>{date}</p>
        </div>
    )
}