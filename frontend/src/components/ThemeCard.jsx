import MovieCard from "./MovieCard.jsx";
import {useEffect, useState} from "react";
import {getMovies} from "../services/movieService.jsx";

export default function ThemeCard({title, name, movieIds, drinkingRules}){
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        getMovies(movieIds).then(setMovies);
    }, []);

    return(
        <div className={"theme-card"}>
            <h1>{title}</h1>
            <h2>{name}</h2>
            {movies.map((movie) =>{
                return <MovieCard
                    key={movie.id}
                    title={movie.title}
                    moviePosterURL={movie.moviePosterURL}
                    runtime={movie.runtime}
                    year={movie.year}
                ></MovieCard>
            })}
            <h1>Drinking Rules:</h1>
            {drinkingRules.map((drinkingRule) => {
                return <h4>{drinkingRule}</h4>
            })}
        </div>
    )
}