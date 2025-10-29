const API_URL = "http://localhost:8080/api/movies"; // backend address

export async function getMovies(movieIds){
    const response = await fetch(`${API_URL}/batchById`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieIds),
    });
    return response.json();
}

export async function getMoviesByTconsts(movieTconsts) {
    const response = await fetch(`${API_URL}/batchByTconst`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieTconsts),
    });
    return response.json();
}
