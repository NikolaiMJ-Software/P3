import {ThemeMovieCard} from "./MovieCard.jsx";
import DrinkingRuleCreator from "./DrinkingRuleCreator.jsx";
import { useTranslation } from "react-i18next";

/**
 * ThemeCreator
 * Handles theme title, selected movies, total runtime, and drinking rules.
 */
export default function ThemeCreator({handleSubmit, movies,handleRemoveMovie, title, setTitle, rules, setRules}){
    const {t} = useTranslation();
    return(
        <div className={"bg-primary drop-shadow-lg items-center flex-col flex gap-1 border-1 sm:m-2 p-2 sm:min-h-[640px]"}>

            {/* Theme title input */}
            <input type={"text"} value={title} onChange={event => setTitle(event.target.value)} placeholder={t("enter theme title")} className={"bg-primary drop-shadow-lg w-55 sm:w-80 text-center text-text-primary border-1 m-2 p-2 rounded-2xl"}/>
            {/* Movies section header */}
            <p className={"text-center text-sm sm:text-base"}>{t("movies")}</p>

            {/* Total runtime display */}
            {movies.length > 0 && (() => {
                const totalRuntime = movies.reduce((sum, m) => sum + (m.runtimeMinutes || 0), 0);
                const totalHours = Math.floor(totalRuntime / 60);
                const totalMinutes = totalRuntime % 60;
                return (
                    <p className="text-center text-sm sm:text-base font-semibold mt-2">
                        {t("total runtime:")} {totalHours}{t("timehour")} {totalMinutes}m
                    </p>
                );
            })()}

            {/* selected movie list */}
            <div className="w-full max-w-[500px] overflow-x-auto overflow-y-hidden gap-">
                <div className={"flex flex-row gap-4 items-center flex-nowrap"}>
                    <div className={"flex flex-row gap-4 items-center"}>
                        {movies.map(movie =>{
                            return<ThemeMovieCard className="flex-shrink-0" title={movie.title} runtimeMinutes={movie.runtimeMinutes} moviePosterURL={movie.moviePosterURL} onRemove={() => handleRemoveMovie(movie.tConst)} isSeries={movie.isSeries} rating={movie.rating}></ThemeMovieCard>
                        })}

                    </div>
                </div>
            </div>
            {/* Drinking rules section */}
            <div className="w-full max-w-full overflow-x-hidden">
                <DrinkingRuleCreator rules={rules} setRules={setRules}/>
            </div>
        </div>
    )
}
