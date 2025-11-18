import {ThemeMovieCard} from "./MovieCard.jsx";
import DrinkingRuleCreator from "./DrinkingRuleCreator.jsx";

export default function ThemeCreator({handleSubmit, movies,handleRemoveMovie, setTitle, rules, setRules}){

    return(
        <div className={"items-center flex-col flex gap-1 border-1 m-2 p-2 min-h-[640px]"}>
            <input type={"text"} onChange={event => setTitle(event.target.value)} placeholder={"Enter theme title"} className={"w-100 text-center text-text-primary border-1 m-2 p-2 rounded-2xl"}/>
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
                        return<ThemeMovieCard title={movie.title} runtimeMinutes={movie.runtimeMinutes} moviePosterURL={movie.moviePosterURL} onRemove={() => handleRemoveMovie(movie.tConst)} isSeries={movie.isSeries} rating={movie.rating}></ThemeMovieCard>
                    })}

                </div>
            </div>
            <DrinkingRuleCreator  rules={rules} setRules={setRules}></DrinkingRuleCreator>
        </div>
    )
}
