import film_tape from '../assets/film_tape.jpg';

export default function MovieShowcase({ movie }){
    return(
    <div className={"w-full h-full flex items-center justify-center bg-black p-4"}>
        <img
        src={movie.moviePosterURL}
        alt={movie.title}
        className={"w-full object-cover"}
        />
    </div>
    )
}