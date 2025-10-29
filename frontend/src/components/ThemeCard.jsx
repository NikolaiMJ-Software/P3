import MovieCard, {MovieCardSmall} from "./MovieCard.jsx";
import {useEffect, useState} from "react";
import {getMovies} from "../services/movieService.jsx";

export default function ThemeCard({title, name, movieIds, drinkingRules}){
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        getMovies(movieIds).then(setMovies);
    }, []);

    return(
        <div className={"w-60 h-80 border-2 border-black" +
            "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>theme
            <h1>{title}</h1>
            <h2>{name}</h2>
            {movies.map((movie) =>{
                return <MovieCardSmall
                    key={movie.movieId}
                    title={movie.title}
                    moviePosterURL={movie.moviePosterURL}
                    runtimeMinutes={movie.runtimeMinutes}
                ></MovieCardSmall>
            })}
            <h1>Drinking Rules:</h1>
            {drinkingRules.map((drinkingRule) => {
                return <h4>{drinkingRule}</h4>
            })}
        </div>
    )
}
export function ThemeCardSmall({title, name, movieIds}){
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        getMovies(movieIds).then(setMovies);
    }, []);

    return(
        <div className={"w-60 h-80 border-2 border-black" +
            "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>theme
            <h1>{title}</h1>
            <h2>{name}</h2>
            {movies.map((movie) =>{
                return <MovieCardSmall
                    key={movie.movieId}
                    title={movie.title}
                    moviePosterURL={movie.moviePosterURL}
                    runtimeMinutes={movie.runtimeMinutes}
                ></MovieCardSmall>
            })}
        </div>
    )
}