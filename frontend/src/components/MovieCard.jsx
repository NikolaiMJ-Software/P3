export default function MovieCard({moviePosterURL, title, year, runtime}){

    return(
        <div className={"theme-card"}>
            <h1>{title}</h1>
            <h3>{year}</h3>
            <h4>{runtime}</h4>
            <img src={moviePosterURL} alt={`Movie poster for the movie ${title}`}></img>
        </div>
    )
}