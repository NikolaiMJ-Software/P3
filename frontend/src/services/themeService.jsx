import { API } from './api.jsx'
const API_URL = `${API}/themes`; //backend address

export async function getThemes(selected) {
    try{
        if (selected === "your"){
            const response = await fetch(`${API_URL}/User?username=${sessionStorage.getItem("username")}`);
            return response.json();
        }else if (selected === "old"){
            const response = await fetch(`${API_URL}/Old`);
            return response.json();
        }else if (selected === "new"){
            const response = await fetch(`${API_URL}/New`);
            return response.json();
        } else {
            const response = await fetch(`${API_URL}`);
            return response.json();}
    }catch (e){
        throw new Error(`Failed to fetch themes, error: ${e}`)
    }
    return;
}

export async function getNewThemes(){
    const response = await fetch(`${API_URL}/New`);
    if (!response.ok) {
        throw new Error(`Failed to fetch new themes: ${response.status}`);
    }
    return response.json()
}

export async function getOldThemes(){
    const response = await fetch(`${API_URL}/Old`);
    if (!response.ok) {
        throw new Error(`Failed to fetch old themes: ${response.status}`);
    }
    return response.json()
}


export async function addTheme(name, username, tConsts, drinkingRules) {
    console.log(`creating theme with username: ${username}`);
    const body =
    {
        name: name,
        username: username,
        tConsts: tConsts,
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

export async function fetchShuffledThemes() {
  try {
    const response = await fetch(`${API}/vote/getShuffledThemes`);
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching shuffled themes:", error);
    throw error;
  }
}

export async function updateThemeVotes(id, votes) {
  try {
    const response = await fetch(`${API}/vote/update-vote/${id}/${votes}`)
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.log("Error updating theme votes: ", error);
    throw error;
  }
}