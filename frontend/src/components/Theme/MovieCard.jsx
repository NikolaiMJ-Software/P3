import { useTranslation } from "react-i18next";

/**
 * MovieCard
 * Simple/full-size movie card variant (title + year + runtime + poster).
 */
export default function MovieCard({moviePosterURL, title, year, runtimeMinutes}){

    return(
        <div>
            <h1>{title}</h1>
            <h3>{year}</h3>
            <h4>{runtimeMinutes}</h4>
            <img src={moviePosterURL} alt={`Movie poster for the movie ${title}`}></img>
        </div>
    )
}

/**
 * MovieCardSmall
 * Compact movie card used for horizontal previews (shows title + rating + poster).
 */
export function MovieCardSmall({moviePosterURL, title, runtimeMinutes, rating}){
    // Format rating safely when missing
    const safeRating = rating ? `${rating}/10⭐` : "No Ratings Available";

    return(
    <div className={"w-[100px] flex flex-col items-center"}>
        <p className={"text-[10px] text-center mt-1 truncate w-full"}>{title}</p>
        <p className="text-[10px] text-center font-semibold">{safeRating} </p>
        <div className="w-[100px] h-[150px] overflow-hidden rounded-md shadow-sm border border-text-secondary bg-primary">
            <img
                src={moviePosterURL}
                alt={`Poster for ${title}`}
                className={`w-full h-full object-cover`}
            />
        </div>
    </div>)
}

/**
 * MovieCardUpcoming
 * Upcoming event variant
 */
export function MovieCardUpcoming({moviePosterURL, title, runtimeMinutes, rating}){
    // Format rating safely when missing
    const safeRating = rating ? `${rating}/10⭐` : "No Ratings Available";
    return(
        <div className={"w-[130px] sm:w-[150px] flex flex-col items-center"}>
            <p className={"text-[10px] text-center mt-1 w-full h-[24px] overflow-hidden leading-tight"}>{title}</p>
            <p className="text-[10px] text-center font-semibold">{safeRating} </p>

            <div className="w-[120px] sm:w-[150px] h-[225px] overflow-hidden rounded-md shadow-sm border border-gray-300 bg-primary">
                <img
                    src={moviePosterURL}
                    alt={`Poster for ${title}`}
                    className={`w-full h-full object-cover`}
                />
            </div>
        </div>)
}

/**
 * ThemeMovieCard
 * Shows poster + title + rating + runtime and an optional remove button.
 */
export function ThemeMovieCard({moviePosterURL, title, runtimeMinutes, onRemove, isSeries, rating}){
    const {t} = useTranslation();
    // Convert runtime into hours + minutes
    const runtimeHours = Math.floor(runtimeMinutes / 60)
    const runtimeMinutesLeft = runtimeMinutes % 60;
    const safeRating = (rating) ? t("rating: ") + rating : t("no ratings available");
    if (isSeries){
        return (
            <div className={"bg-primary drop-shadow-lg w-full max-w-[180px] flex flex-col items-center border-2 rounded-2xl overflow-hidden"}>
                <p className={"text-[10px] text-center mt-1 w-full h-[24px] overflow-hidden leading-tight break-words"}>{title}</p>
                <p className={"text-[10px] text-center truncate w-full text-xs"}>{safeRating} ⭐</p>
                <div className="w-[150px] h-[220px] overflow-hidden rounded-md shadow-sm border border-text-secondary bg-primary">
                    <img
                        src={moviePosterURL}
                        alt={`Poster for ${title}`}
                        className={`w-full h-full object-cover`}
                    />
                </div>
                <p className={"font-bold"}>Series</p>
                {onRemove && (
                    <button onClick={onRemove} className="text-text-error font-bold px-3 py-1 rounded-xl hover:text-red-700 cursor-pointer">{t("remove")}</button>
                )}
            </div>
        )
    }

    return(
        <div className={"bg-primary drop-shadow-lg w-full max-w-[180px] flex flex-col items-center border-2 rounded-2xl overflow-hidden"}>
            <p className={"text-[15px] text-center mt-1 truncate pl-1 w-full text-base sm:text-lg break-words"}>{title}</p>
            <p className={"text-[10px] text-center mt-1 truncate w-full text-xs"}>{safeRating} ⭐</p>
            <div className="w-[150px] h-[220px] overflow-hidden rounded-md shadow-sm border border-text-secondary bg-primary">
                <img
                    src={moviePosterURL}
                    alt={`Poster for ${title}`}
                    className={`w-full h-full object-cover`}
                />
            </div>
            <p className="text-sm sm:text-base">{runtimeHours + t("timehour") + runtimeMinutesLeft + "m"}</p>
            {onRemove && (
                <button onClick={onRemove} className="text-text-error text-sm sm:text-base font-bold px-3 py-1 rounded-xl hover:text-red-700 cursor-pointer">{t("remove")}</button>
            )}
        </div>)
}