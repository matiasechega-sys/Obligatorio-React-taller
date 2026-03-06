const URL = "https://api-react-taller-production.up.railway.app";

// --- AUTENTICACIÓN ---
const register = async (username, name, password) => {
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
    return { error: "Error de conexión" };
  }
};

const login = async (username, password) => {
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

    console.log("Login", data);
    return data;
  } catch (error) {
    console.error("Error en Login:", error);
    return { error: "Error de conexión" };
  }
};

// --- LOCALES ---
const getLocals = async (q = "", type = "", priceRange = "", rating = "", city = "", zone = "") => {
  try {
    // 1. Intentamos traer datos de la API con filtros
    const response = await fetch(
      `${URL}/api/locals?q=${q}&type=${type}&priceRange=${priceRange}&rating=${rating}&city=${city}&zone=${zone}`
    );
    const data = await response.json();
    
    const listaApi = Array.isArray(data) ? data : [];

    // 2. Traemos locales guardados manualmente en el navegador (Híbrido)
    const localesLocales = JSON.parse(localStorage.getItem("mis_locales_propios") || "[]");

    // 3. Combinamos y quitamos duplicados por nombre
    const combinados = [...localesLocales, ...listaApi];
    const unicos = combinados.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);

    return unicos;
  } catch (error) {
    console.error("Error obteniendo locales, usando backup local:", error);
    return JSON.parse(localStorage.getItem("mis_locales_propios") || "[]");
  }
};

const postLocal = async ({ name, type, priceRange, city, zone, address, hours, photos = [], rating = 5 }) => {
  try {
    // Guardado local preventivo
    const actuales = JSON.parse(localStorage.getItem("mis_locales_propios") || "[]");
    localStorage.setItem("mis_locales_propios", JSON.stringify([{ name, type, priceRange, city, zone, address, hours, photos, rating }, ...actuales]));

    const token = localStorage.getItem("token");
    const response = await fetch(`${URL}/api/locals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ name, type, priceRange, city, zone, address, hours, photos, rating }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al crear el local");
    return data;
  } catch (error) {
    console.error("Error creando local:", error);
    return { success: true, note: "Guardado localmente" };
  }
};

const getLocal = async (id) => {
  try {
    const response = await fetch(`${URL}/api/locals/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo local:", error);
    return null;
  }
};

// --- PLATOS (DISHES) ---
const getPlatos = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${URL}/api/dishes?${query}`);
    const data = await response.json();
    
    const listaApi = Array.isArray(data) ? data : (data.dishes || []);

    // Recuperar platos creados localmente
    const platosLocales = JSON.parse(localStorage.getItem("mis_platos_propios") || "[]");

    // Combinar y eliminar duplicados
    const combinados = [...platosLocales, ...listaApi];
    const unicos = combinados.filter((v, i, a) => 
      a.findIndex(t => t.name === v.name && t.localId === v.localId) === i
    );

    return unicos;
  } catch (error) {
    console.error("Error obteniendo platos:", error);
    return JSON.parse(localStorage.getItem("mis_platos_propios") || "[]");
  }
};

const postPlato = async (platoData) => {
  try {
    // Persistencia local inmediata
    const actuales = JSON.parse(localStorage.getItem("mis_platos_propios") || "[]");
    const nuevoPlato = { ...platoData, id: Date.now(), createdAt: new Date().toISOString() };
    localStorage.setItem("mis_platos_propios", JSON.stringify([nuevoPlato, ...actuales]));

    const token = localStorage.getItem("token");
    const response = await fetch(`${URL}/api/dishes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(platoData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al crear el plato");
    
    return { success: true, ...data };
  } catch (error) {
    console.error("Error creando plato:", error);
    return { success: true, note: "Plato guardado localmente" };
  }
};

const getPlato = async (id) => {
  try {
    const response = await fetch(`${URL}/api/dishes/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo plato:", error);
    return null;
  }
};

// --- USUARIOS Y REVIEWS ---
const getUser = async (id) => {
  try {
    const response = await fetch(`${URL}/api/users/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    return null;
  }
};

const postReview = async (id, rating, comment) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${URL}/api/locals/${id}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ rating, comment }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando review:", error);
    return { error: "Error de conexión" };
  }
};

export {
  register,
  login,
  getLocals,
  postLocal,
  getLocal,
  getPlatos,
  postPlato,
  getPlato,
  getUser,
  postReview,
};