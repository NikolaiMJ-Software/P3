import { API } from './api.jsx'
const API_URL = `${API}/movies`; //backend address
//send a bunch of movieIds, get a bunch of movies
export async function getMovies(movieIds){
    const response = await fetch(`${API_URL}/batchById`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieIds),
    });
    return response.json();
}
//send a bunch of tconsts get a bunch of movies
export async function getMoviesByTconsts(movieTconsts) {
    if (!Array.isArray(movieTconsts)){
        console.error("movieTconsts not an array");
    }
    try{
        const response = await fetch(`${API_URL}/batchByTconst`,{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(movieTconsts),

        });
        if (!response.ok){
            console.error("Server responded with: ", response.status);
            return[];
        }
        const data = await response.json();

        if (!Array.isArray(data)) {
            console.error("Expected array, received: ", data);
            return [];
        }

        return data;
    }catch (e) {
        console.error("Error fetching movies:", e);
        return[];
    }
}
//search for movies with all search parameters
export async function searchMovies(query, page, limit, sortBy = "rating", direction = "desc", movie, series, shorts, hideUnrated){
    const ratedParam = hideUnrated !== undefined ? `&rated=${hideUnrated}` : "";
    const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&sortBy=${sortBy}&direction=${direction}&movie=${movie}&series=${series}&shorts=${shorts}${ratedParam}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    });
    if (!response.ok){
        throw new Error('Failed to count movies: ${response.status}');
    }
    return response.json();
}

export async function getMovieCount(query){
    const response = await fetch(`${API_URL}/search/count?q=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    });
    return response.json();
}
export async function getMoviePoster(tConst){
    const response = await fetch(`${API_URL}/poster/${tConst}`);
    if (!response.ok) throw new Error("Failed to fetch poster");
    return await response.text(); // your endpoint returns string
}

export async function getMoviePosterById(id){
    const response = await fetch(`${API_URL}/poster/id/${id}`);
    if (!response.ok) throw new Error("Failed movie poster by id");
    return await response.text();
}