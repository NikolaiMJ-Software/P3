import { API } from './api.jsx'
const API_URL = `${API}/movies`; //backend address

export async function getMovies(movieIds){
    const response = await fetch(`${API_URL}/batchById`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieIds),
    });
    return response.json();
}

export async function getMoviesByTconsts(movieTconsts) {
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

export async function searchMovies(query, page, limit){
    const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`, {
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
