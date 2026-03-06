const URL = "https://api-react-taller-production.up.railway.app";

// --- LOGIN ---
export const login = async (username, password) => {
  // Ahora llamamos a NUESTRA API interna
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  if (response.ok && data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return { success: true, ...data };
  }
  return { success: false, error: data.error };
}

// --- REGISTER ---
export const register = async (username, name, password) => {
  // Ahora llamamos a NUESTRA API interna
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, name, password })
  });
  return await response.json();
}

export const postLocal = async (name, type, priceRange, city, zone, address, hours, photos) => {
    try {
        const token = localStorage.getItem("token");
        
        // Si no hay token, el servidor de Railway siempre dará error 401
        if (!token) {
            console.error("No hay token disponible");
            return { error: "Debes iniciar sesión para crear un local" };
        }

        const response = await fetch(`${URL}/api/locals`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ 
                name: name.trim(), 
                type, 
                priceRange, 
                city, 
                zone: zone.trim(), 
                address: address.trim(), 
                hours, 
                photos: Array.isArray(photos) ? photos : [photos] 
            })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en postLocal:", error);
        return { error: "Error de conexión" };
    }
}

// --- RESTO DE MÉTODOS (GET, REVIEWS) ---
export const getLocals = async (q="", type="", priceRange="", rating="", city="", zone="") => {
    try {
        const params = new URLSearchParams({ q, type, priceRange, rating, city, zone });
        const response = await fetch(`${URL}/api/locals?${params.toString()}`);
        const data = await response.json();
        return Array.isArray(data) ? data : (data.locals || []);
    } catch (error) { return []; }
}