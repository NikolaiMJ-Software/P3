export default function MovieCard({moviePosterURL, title, year, runtimeMinutes}){

    return(
        <div className={"theme-card"}>
            <h1>{title}</h1>
            <h3>{year}</h3>
            <h4>{runtimeMinutes}</h4>
            <img src={moviePosterURL} alt={`Movie poster for the movie ${title}`}></img>
        </div>
    )
}
export function MovieCardSmall({moviePosterUrl, title, runtimeMinutes}){
    return(<div>
        <h1>{title}</h1>
        <p>{runtimeMinutes}</p>
        <img src={moviePosterUrl} width={50} height={70}/>
    </div>)
}