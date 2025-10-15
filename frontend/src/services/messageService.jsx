const API_URL = "http://localhost:8080/api/messages"; // backend address

export async function getMessages() {
    const response = await fetch(API_URL);
    return response.json();
}

export async function addMessage(content) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: content,
    });
    return response.json();
}

export async function deleteMessage(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}
