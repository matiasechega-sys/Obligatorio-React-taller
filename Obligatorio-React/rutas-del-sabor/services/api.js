const URL = "https://api-react-taller-production.up.railway.app";

// --- AUTENTICACIÓN ---

export const register = async (username, name, password) => {
    try {
        const response = await fetch(`${URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, name, password }),
        });
        const data = await response.json();
        console.log("Información de Register", data);
        return data;
    } catch (error) {
        console.error("Error en Register:", error);
    }
}

export const login = async (username, password) => {
    try {
        const response = await fetch(`${URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
        }
        console.log("Login", data);
        return data;
    } catch (error) {
        console.error("Error en Login:", error);
    }
}

// --- LOCALES ---

export const getLocales = async (q="", type="", priceRange="", rating="", city="", zone="") => {
    try {
        // Esta línea construye el link con los filtros que pide la letra
        const response = await fetch(`${URL}/api/locals?q=${q}&type=${type}&priceRange=${priceRange}&rating=${rating}&city=${city}&zone=${zone}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error obteniendo locales:", error);
        return [];
    }
}

export const postLocal = async (name, type, priceRange, city, zone, address, hours, photos) => {
    try {
        const response = await fetch(`${URL}/api/locals`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ name, type, priceRange, city, zone, address, hours, photos })
        });
        return await response.json();
    } catch (error) {
        console.error("Error creando local:", error);
    }
}

export const getLocal = async (id) => {
    const response = await fetch(`${URL}/api/locals/${id}`);
    return await response.json();
}

// --- USUARIOS Y REVIEWS ---

export const getUser = async (id) => {
    const response = await fetch(`${URL}/api/users/${id}`);
    return await response.json();
}

export const postReview = async (id, rating, comment) => {
    try {
        const response = await fetch(`${URL}/api/locals/${id}/reviews`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ rating, comment })
        });
        return await response.json();
    } catch (error) {
        console.error("Error en Review:", error);
    }
}