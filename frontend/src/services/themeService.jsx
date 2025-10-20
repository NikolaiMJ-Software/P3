const API_URL = "http://localhost:8080/api/themes"; // backend address

export async function getThemes() {
    const response = await fetch(API_URL);
    return response.json();
}

export async function addTheme(name, userId, movieIds, drinkingRules) {
    const body = {
        name: name,
        userId: userId,
        movieIds: movieIds,
        drinkingRules: drinkingRules
    };

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!response.ok){
        throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return response.text();
}

export async function deleteTheme(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}
