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
export function MovieCardSmall({moviePosterURL, title, runtimeMinutes}){
    return(
    <div className={"w-[95px] flex flex-col items-center"}>
        <p className={"text-[10px] text-center mt-1 truncate w-full"}>{title}</p>
        <div className="w-[100px] h-[150px] overflow-hidden rounded-md shadow-sm border border-gray-300 bg-white">
            <img
                src={moviePosterURL}
                alt={`Poster for ${title}`}
                className={`w-full h-full object-cover`}
            />
        </div>
    </div>)
}