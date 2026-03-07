const URL = "https://api-react-taller-production.up.railway.app";

// --- HELPERS ---
const getAuthToken = () => localStorage.getItem("token");

const cleanIdParam = (id) => {
  if (!id) return "";
  // Limpia caracteres especiales y espacios para evitar errores de URL
  return String(id).replace(/[^a-zA-Z0-9]/g, '').trim();
};

// --- AUTENTICACIÓN ---
export const register = async (username, name, password) => {
  try {
    const response = await fetch(`${URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, name, password }),
    });
    return await response.json();
  } catch (error) {
    return { error: "Error de conexión" };
  }
};

export const login = async (username, password) => {
  try {
    const response = await fetch(`${URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    return { error: "Error de conexión" };
  }
};

// --- LOCALES ---
export const getLocals = async (q = "", type = "", priceRange = "", rating = "", city = "", zone = "") => {
  try {
    const response = await fetch(`/api/locals?q=${q}&type=${type}&priceRange=${priceRange}&rating=${rating}&city=${city}&zone=${zone}`);
    const data = await response.json();
    const listaApi = Array.isArray(data) ? data : [];
    const localesLocales = JSON.parse(localStorage.getItem("mis_locales_propios") || "[]");
    const combinados = [...listaApi, ...localesLocales];
    return combinados.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);
  } catch (error) {
    return JSON.parse(localStorage.getItem("mis_locales_propios") || "[]");
  }
};

export const postLocal = async (localData) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`/api/locals`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(localData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al crear local");
    return { success: true, ...data };
  } catch (error) {
    const actuales = JSON.parse(localStorage.getItem("mis_locales_propios") || "[]");
    const localTemp = { ...localData, _id: `temp-${Date.now()}` };
    localStorage.setItem("mis_locales_propios", JSON.stringify([localTemp, ...actuales]));
    return { success: true, note: "Guardado local", data: localTemp };
  }
};

// --- PLATOS (DISHES) ---
export const getPlatos = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`/api/dishes?${query}`);
    const data = await response.json();
    const listaApi = Array.isArray(data) ? data : (data.dishes || []);
    const platosLocales = JSON.parse(localStorage.getItem("mis_platos_propios") || "[]");
    const combinados = [...listaApi, ...platosLocales];
    return combinados.filter((v, i, a) => a.findIndex(t => (t._id === v._id || t.name === v.name)) === i);
  } catch (error) {
    return JSON.parse(localStorage.getItem("mis_platos_propios") || "[]");
  }
};

export const postPlato = async (platoData) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`/api/dishes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(platoData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al crear plato");
    return { success: true, ...data };
  } catch (error) {
    const actuales = JSON.parse(localStorage.getItem("mis_platos_propios") || "[]");
    const nuevoPlato = { ...platoData, _id: `temp-${Date.now()}` };
    localStorage.setItem("mis_platos_propios", JSON.stringify([nuevoPlato, ...actuales]));
    return { success: true, note: "Guardado local", data: nuevoPlato };
  }
};

// --- REVIEWS ---
export const postReviewLocal = async (id, rating, comment) => {
  try {
    const cleanId = cleanIdParam(id);
    if (!cleanId || cleanId.startsWith('temp')) throw new Error("ID no válido para reseña");
    const token = getAuthToken();
    const response = await fetch(`/api/locals/${cleanId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ rating: Number(rating), comment }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error en reseña");
    return { success: true, ...data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const postReviewPlato = async (id, rating, comment) => {
  try {
    const cleanId = cleanIdParam(id);
    if (!cleanId || cleanId.startsWith('temp')) throw new Error("ID no válido para reseña");
    const token = getAuthToken();
    const response = await fetch(`/api/dishes/${cleanId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ rating: Number(rating), comment }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error en reseña de plato");
    return { success: true, ...data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
export const getUser = async (id) => {
  try {
    const cleanId = cleanIdParam(id);
    const response = await fetch(`${URL}/api/users/${cleanId}`);
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    return null;
  }
};
export {
  register,
  login,
  getLocals,
  postLocal,
  getPlatos,
  postPlato,
  getUser,
  postReviewLocal,
  postReviewPlato,
};