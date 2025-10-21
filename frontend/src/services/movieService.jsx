const API_URL = "http://localhost:8080/api/movies"; // backend address

export async function getMovie(movieId) {
    const response = await fetch(`${API_URL}/${movieId}`);
    return response.json();
}

export async function getMovies(movieIds){
    const response = await fetch(`${API_URL}/batch`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieIds),
    });
    return response.json();
}
