import {useEffect, useState} from "react";
import {getNextEvent} from "../services/eventService.jsx";
import {getMoviesByTconsts} from "../services/movieService.jsx";
import logo from "../../public/logo.png"
import ShowcaseMovieCard from "../components/ShowcaseMovieCard.jsx";
export default function EventShowcasePage(){
    const [event, setEvent] = useState({})
    const [movies, setMovies] = useState([])
    useEffect(() =>  {
        const loadEvent = async () => {
            const nextEvent = await getNextEvent();

            if(!nextEvent){
                setEvent(null)
            }

            setEvent(nextEvent)
            const movieData = await getMoviesByTconsts(nextEvent.tConsts)
            setMovies(movieData || [])
        }
        loadEvent()
    }, []);

    return (
        <div>
            <img src={logo} alt={"F-kult Logo"}/>
            {movies.map(movie => {return <ShowcaseMovieCard movie={movie}/>})}
        </div>
    )
}