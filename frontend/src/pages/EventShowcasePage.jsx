import {useEffect, useState} from "react";
import {getNextEvent} from "../services/eventService.jsx";
import {getMoviesByTconsts} from "../services/movieService.jsx";
import logo from "../../public/logo.png"
import ShowcaseMovieCard from "../components/ShowcaseMovieCard.jsx";
import film_tape from '../assets/film_tape.jpg';
import MovieShowcase from "../components/MovieShowcase.jsx";

export default function EventShowcasePage(){
    const [event, setEvent] = useState(null)
    const [movies, setMovies] = useState([])

    useEffect(() =>  {
        const loadEvent = async () => {
            const nextEvent = await getNextEvent();

            if(!nextEvent){
                setEvent(null)
                console.log("error happened")
                return;
            }
            console.log("fetched")
            setEvent(nextEvent);

            const movieData = await getMoviesByTconsts(nextEvent.tConsts)
            setMovies(movieData || [])
        }
        loadEvent()
    }, []);
    if(!event) return <p>Loading...</p>
    if (event.tConsts && movies.length <= 0) return <p>Loading movies...</p>;


    const date = new Date(event.timestamp);

    const day = date.getDate().toString().padStart(2,"0");
    const month = (date.getMonth()+1).toString().padStart(2,"0");
    const year = date.getFullYear();
    const hour = date.getHours().toString().padStart(2,"0");
    const minute = date.getMinutes().toString().padStart(2,"0");

    //startup day
    if (event.tConsts === null){
        return (
            <div className={"-m-5 overflow-hidden relative w-full grid grid-rows-[80px_1fr_80px] h-screen"}>
                <div className="w-full h-20"
                     style={{
                         backgroundImage: `url(${film_tape})`,
                         backgroundRepeat: "repeat-x",
                         backgroundSize: "contain"
                     }}/>
                <div className={"grid grid-cols-1 w-full"}>
                    {/* CENTER TEXT BLOCK */}
                    <div className="text-center p-6 flex flex-col justify-center">
                        <h1 className="text-9xl font-bold mb-4">F-KULT</h1>
                        <h1 className="text-9xl font-bold mb-4 italic">Semester Start</h1>
                        <img src={logo} alt="Logo" className="w-64 mx-auto my-4" />
                        <p className="text-5xl font-bold">
                            {day}/{month}/{year}
                        </p>
                        <p className="text-3xl font-bold">
                            kl. {hour}:{minute}
                        </p>

                        <p className="mt-6 text-3xl leading-relaxed">
                            Kom og stem på temaer!
                        </p>
                    </div>
                </div>
                <div className="w-full h-20"
                     style={{
                         backgroundImage: `url(${film_tape})`,
                         backgroundRepeat: "repeat-x",
                         backgroundSize: "contain"
                     }}/>
                <button
                    onClick={() => document.documentElement.requestFullscreen()}
                    className="absolute top-4 right-6  px-4 py-2 rounded"
                >
                    []
                </button>
            </div>
        )
    }

    return (
        <div className={"-m-5 overflow-hidden relative w-full grid grid-rows-[80px_1fr_80px] h-screen"}>
            <div className="w-full h-20"
                style={{
                    backgroundImage: `url(${film_tape})`,
                    backgroundRepeat: "repeat-x",
                    backgroundSize: "contain"
                }}/>
            <div className={"grid grid-cols-3 w-full"}>
                {/* LEFT MOVIE */}
                <MovieShowcase movie={movies[0]} />

                {/* CENTER TEXT BLOCK */}
                <div className="text-center p-6 flex flex-col justify-center">
                    <h1 className="text-9xl font-bold mb-4">F-KULT</h1>
                    <img src={logo} alt="Logo" className="w-64 mx-auto my-4" />
                    <p className="text-5xl font-bold">
                        {day}/{month}/{year}
                    </p>
                    <p className="text-2xl font-bold">
                        kl. {hour}:{minute}
                    </p>

                    <p className="mt-6 text-3xl leading-relaxed">
                        Kom og se film på Cassiopeia
                    </p>

                    <p className="mt-6 text-2xl">
                        Temaet er:
                        <br/>
                        <span className="text-5xl font-bold">
                            {event.name}
                        </span>
                        <br/>
                        {movies[0].title} ({movies[0].year})
                    </p>
                </div>

                {/* RIGHT MOVIE */}
                {movies[1] && <MovieShowcase movie={movies[1]} />}
            </div>
            <div className="w-full h-20"
                 style={{
                     backgroundImage: `url(${film_tape})`,
                     backgroundRepeat: "repeat-x",
                     backgroundSize: "contain"
                 }}/>
            <button
                onClick={() => document.documentElement.requestFullscreen()}
                className="absolute top-4 right-6  px-4 py-2 rounded"
            >
                []
            </button>
        </div>
    )
}