import MovieCard, {MovieCardSmall, ThemeMovieCard, MovieCardUpcoming} from "./MovieCard.jsx";
import {useEffect, useState} from "react";
import {getMovies, getMoviesByTconsts} from "../../services/movieService.jsx";
import {useTranslation} from "react-i18next";
import logo from "../../assets/logo.png"

export default function ThemeCard({title, name, tConsts, drinkingRules, isSeries, timestamp}){
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        getMoviesByTconsts(tConsts).then(setMovies)
    }, [tConsts]);

    const safeMovies = Array.isArray(movies) ? movies : [];
    const {t} = useTranslation();
    return(
        <div className={"relative w-60 h-80 border-2 border-text-primary rounded-xl p-3 flex flex-col justify-between text-lg font-medium shadow-sm hover:shadow-md transition shrink-0 bg-white" +
            "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>
            <div>
                <h1 className={"text-xl font-bold"}>{title}</h1>
                <h2 className={"text-sm text-text-secondary"}>{name}</h2>
                <h3 className={"mt-2 font-semibold text-sm"}>{t("drinking rules")}</h3>
                <ul className={"text-xs list-disc list-inside overflow-y-auto max-h-16"}>{drinkingRules.map((rule) => {return (<li key={rule}>{rule}</li>)})}</ul>
            </div>

            <div className={"flex justify-between gap-2 mt-2"}>
                {safeMovies.slice(0,2).map((movie) => (
                    <MovieCardSmall key={movie.id} title={movie.title} moviePosterURL={movie.moviePosterURL} runtimeMinutes={movie.runtimeMinutes}/>
                ))}
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
        <div className={"w-60 h-80 border-2 border-text-primary" +
            "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>
            <h1>{title}</h1>
            <h2>{name}</h2>
            {movies.map((movie, i) =>{
                return <MovieCardSmall
                    key={movie.i}
                    title={movie.title}
                    name={movie.username}
                    moviePosterURL={movie.moviePosterURL}
                    runtimeMinutes={movie.runtimeMinutes}
                ></MovieCardSmall>
            })}
        </div>
    )
}
export function ThemeCreationCard({onClick}){
    const {t} = useTranslation();
    return(
        <div onClick={onClick} className={"relative w-60 h-80 border-2 border-text-primary rounded-xl p-3 flex flex-col justify-center items-center cursor-pointer text-lg font-medium shadow-sm hover:shadow-md transition shrink-0 bg-white" +
            "text-lg font-medium shadow-sm hover:bg-green-100 transition shrink-0"}>
            <p className={"mb-4 text-center"}>{t("create theme")}</p>
            <div className={"bg-green-200 flex justify-center items-center w-16 h-16 border-5 border-green-500 rounded-full"}>
                <span className="text-5xl font-bold text-green-500 mb-2.5">+</span>
            </div>
        </div>
    )
}

export function StartupCard({date}){
    return(
        <div onClick={onClick} className={"relative w-60 h-80 border-2 border-text-primary rounded-xl p-3 flex flex-col justify-center items-center cursor-pointer text-lg font-medium shadow-sm hover:shadow-md transition shrink-0 bg-white" +
            "text-lg font-medium shadow-sm hover:bg-green-100 transition shrink-0"}>
            <p className={"mb-4 text-center"}>Startup Day</p>
            <p className={"mb-4 text-center"}>{date}</p>
        </div>
    )
}
export function EventThemeCard({title, name, tConsts, drinkingRules, isSeries, timestamp}){
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        getMoviesByTconsts(tConsts).then(setMovies)
    }, [tConsts]);

    const year = () => {
        return timestamp.split("-")[0];
    }
    const month = () => {
        return timestamp.split("-")[1];
    }
    const day = () => {
        return timestamp.split("-")[2].split("T")[0];
    }
    const hour = () => {
        return timestamp.split("-")[2].split("T")[1].split(":")[0];
    }
    const minute = () => {
        return timestamp.split("-")[2].split("T")[1].split(":")[1];
    }

    const safeMovies = Array.isArray(movies) ? movies : [];
    const {t} = useTranslation();
    return(
        <div className={"relative w-85 h-114 border-2 border-black rounded-xl p-3 flex flex-col justify-between text-lg font-medium shadow-sm hover:shadow-md transition shrink-0 bg-white" +
            "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>
            <div>
                <h1 className={"text-xl font-bold"}>{title}</h1>
                <h2 className={"text-sm text-gray-600"}>{name}</h2>
                <h2 className={"font-bold text-sm"}>{day() + "/" + month() + "/" + year()}</h2>
                <h2 className={"font-bold text-sm"}>{"kl. "+hour() + ":" + minute()}</h2>
                <h3 className={"mt-2 font-semibold text-sm"}>{t("drinking rules")}</h3>
                <ul className={"text-xs list-disc list-inside overflow-y-auto max-h-16"}>{drinkingRules.map((rule) => {return (<li key={rule}>{rule}</li>)})}</ul>
            </div>

            <div className={"flex justify-between gap-2 mt-2"}>
                {safeMovies.slice(0,2).map((movie) => (
                    <MovieCardUpcoming key={movie.id} title={movie.title} moviePosterURL={movie.moviePosterURL} runtimeMinutes={movie.runtimeMinutes}/>
                ))}
            </div>
        </div>
    )
}

export function EventStartup({name, timestamp}){

    const year = () => {
        return timestamp.split("-")[0];
    }
    const month = () => {
        return timestamp.split("-")[1];
    }
    const day = () => {
        return timestamp.split("-")[2].split("T")[0];
    }
    const hour = () => {
        return timestamp.split("-")[2].split("T")[1].split(":")[0];
    }
    const minute = () => {
        return timestamp.split("-")[2].split("T")[1].split(":")[1];
    }
    const {t} = useTranslation();
    return(
        <div className={"relative w-85 h-114 border-2 border-black rounded-xl p-3 flex flex-col justify-between text-lg font-medium shadow-sm hover:shadow-md transition shrink-0 bg-white" +
            "text-lg font-medium shadow-sm hover:shadow-md transition shrink-0"}>
            <div>
                <h1 className={"text-xl font-bold"}>F-Kult Start</h1>
                <h2 className={"font-bold text-sm"}>{day() + "/" + month() + "/" + year()}</h2>
                <h2 className={"font-bold text-sm"}>{"kl. "+hour() + ":" + minute()}</h2>
                <h3 className={"font-bold text-lg"}>Kom og stem på Temaer</h3>
                <img src={logo}/>
            </div>
        </div>
    )
}