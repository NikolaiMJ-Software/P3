import {ThemeMovieCard} from "./MovieCard.jsx";
import DrinkingRuleCreator from "./DrinkingRuleCreator.jsx";

export default function ThemeCreator({handleSubmit, movies,handleRemoveMovie}){

    return(
        <div className={"items-center flex-col flex gap-1 border-1 m-2 p-2 w-[600px]"}>
            <input type={"text"} placeholder={"Enter theme title"} className={"w-100 text-center text-black border-1 m-2 p-2 rounded-2xl"}/>
            <button
                onClick={handleSubmit}
                className={"absolute bottom-4 left-1/2 transform -translate-x-1/2 font-semibold px-8 py-3 rounded-xl border-2 border-black hover:bg-gray-300"}>
                Submit
            </button>
            <p className={"text-center"}>Movies</p>
            {movies.length > 0 && (() => {
                const totalRuntime = movies.reduce((sum, m) => sum + (m.runtimeMinutes || 0), 0);
                const totalHours = Math.floor(totalRuntime / 60);
                const totalMinutes = totalRuntime % 60;
                return (
                    <p className="text-center font-semibold mt-2">
                        Total runtime: {totalHours}h {totalMinutes}m
                    </p>
                );
            })()}

            <div className={"w-full max-w-[500px] overflow-x-auto overflow-y-hidden gap-"}>
                <div className={"flex flex-row gap-4 items-center"}>
                    {movies.map(movie =>{
                        return<ThemeMovieCard title={movie.title} runtimeMinutes={movie.runtimeMinutes} moviePosterURL={movie.moviePosterURL} onRemove={() => handleRemoveMovie(movie.tConst)} isSeries={movie.isSeries}></ThemeMovieCard>
                    })}

                </div>
            </div>
            <DrinkingRuleCreator></DrinkingRuleCreator>
        </div>
    )
}
