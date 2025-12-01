export default function ShowcaseMovieCard({movie}){
    const safeTitle = movie.title ? movie.title : ""
    return(
        <div>
            <h1 className={"font-bold text-9xl"}>{safeTitle}</h1>
            <h3 className={"text-9xl"}>{movie.year}</h3>
            <img src={movie.moviePosterURL} alt={`Movie poster for the movie ${safeTitle}`}></img>
        </div>
    )
}