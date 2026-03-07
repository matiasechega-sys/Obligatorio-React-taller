// --- LOGIN ---
export const login = async (username, password) => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (response.ok && data.token) {
      localStorage.setItem("token", data.token);
      const userData = data.user || { username: username };
      localStorage.setItem("user", JSON.stringify(userData));
      return { success: true, ...data };
    }
    return { success: false, error: data.error || "Credenciales incorrectas" };
  } catch (error) {
    return { success: false, error: "Error de conexión con el servidor" };
  }
}

// --- REGISTER ---
export const register = async (username, name, password) => {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, name, password })
    });
    return await response.json();
  } catch (error) {
    return { error: "Error de conexión" };
  }
}

// --- GET LOCALS (HÍBRIDO: API + LOCALSTORAGE) ---
export const getLocals = async () => {
  try {
    const token = localStorage.getItem("token");
    const timestamp = new Date().getTime();
    
    const response = await fetch(`/api/locals?t=${timestamp}`, {
      headers: { 
        "Authorization": token ? `Bearer ${token}` : "",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache"
      }
    });

    const data = await response.json();
    
    let listaApi = [];
    if (Array.isArray(data)) {
      listaApi = data;
    } else {
      listaApi = data.locals || data.data || [];
    }

    const localesLocales = JSON.parse(localStorage.getItem("mis_locales_propios") || "[]");
    const combinados = [...localesLocales, ...listaApi];
    const unicos = combinados.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);

    return unicos;
  } catch (error) {
    console.error("Error en getLocals, usando backup local:", error);
    return JSON.parse(localStorage.getItem("mis_locales_propios") || "[]");
  }
};

// --- POST LOCAL (HÍBRIDO) ---
export const postLocal = async (localData) => {
  try {
    const actuales = JSON.parse(localStorage.getItem("mis_locales_propios") || "[]");
    const nuevaLista = [localData, ...actuales];
    localStorage.setItem("mis_locales_propios", JSON.stringify(nuevaLista));

    const token = localStorage.getItem("token");
    const response = await fetch("/api/locals", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(localData)
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al guardar en API");
    
    return { success: true, ...data };
  } catch (error) {
    console.error("Error en postLocal:", error);
    return { success: true, note: "Guardado localmente" };
  }
};

// --- GET DISHES (HÍBRIDO) ---
export const getPlatos = async (params = {}) => {
  try {
    const token = localStorage.getItem("token");
    const query = new URLSearchParams(params).toString();
    
    const response = await fetch(`/api/dishes?${query}`, {
      headers: { 
        "Authorization": token ? `Bearer ${token}` : "",
        "Cache-Control": "no-cache"
      }
    });

    const data = await response.json();
    const listaApi = Array.isArray(data) ? data : (data.dishes || []);

    const platosLocales = JSON.parse(localStorage.getItem("mis_platos_propios") || "[]");
    const combinados = [...platosLocales, ...listaApi];
    
    // Evitamos duplicados por nombre y localId
    const unicos = combinados.filter((v, i, a) => 
      a.findIndex(t => t.name === v.name && t.localId === v.localId) === i
    );

    return unicos;
  } catch (error) {
    console.error("Error en getPlatos, usando backup local:", error);
    return JSON.parse(localStorage.getItem("mis_platos_propios") || "[]");
  }
};

// --- POST DISH (HÍBRIDO: IGUAL QUE POST LOCAL) ---
export const postPlato = async (platoData) => {
  try {
    // 1. Limpieza de datos (Conversión de tipos para evitar errores de API)
    const dataLimpia = {
      ...platoData,
      localId: Number(platoData.localId),
      price: Number(platoData.price),
      createdAt: new Date().toISOString()
    };

    // 2. Guardado en LocalStorage (Backup preventivo como en locales)
    const actuales = JSON.parse(localStorage.getItem("mis_platos_propios") || "[]");
    const nuevaLista = [dataLimpia, ...actuales];
    localStorage.setItem("mis_platos_propios", JSON.stringify(nuevaLista));

    // 3. Intento de guardado en la API
    const token = localStorage.getItem("token");
    const response = await fetch("/api/dishes", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(dataLimpia)
    });

    const data = await response.json();
    
    if (!response.ok) {
        // Lanzamos error para que lo capture el catch y devuelva el éxito local
        throw new Error(data.error || "Error al guardar plato en API");
    }

    return { success: true, ...data };
  } catch (error) {
    console.error("Error en postPlato (API falló, usando local):", error);
    // Retornamos éxito pero con nota, igual que en postLocal
    return { success: true, note: "Guardado localmente", error: error.message };
  }
};


export const postReviewLocal = async (localId, reviewData) => {
  try {
    const token = localStorage.getItem("token");
    // Llamamos a tu API de Next.js que creamos anteriormente
    const response = await fetch(`/api/locals/${localId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        rating: Number(reviewData.puntuacion),
        comment: reviewData.comentario
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al publicar reseña");

    return { success: true, data };
  } catch (error) {
    console.error("Error en postReviewLocal:", error);
    return { success: false, error: error.message };
  }
};

// --- POST REVIEW DISH (PLATO) ---
export const postReviewPlato = async (platoId, reviewData) => {
  try {
    const token = localStorage.getItem("token");
    // Asumiendo que crearás la ruta /api/dishes/[id]/reviews similar a la de locales
    const response = await fetch(`/api/dishes/${platoId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        rating: Number(reviewData.puntuacion),
        comment: reviewData.comentario
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al publicar reseña del plato");

    return { success: true, data };
  } catch (error) {
    console.error("Error en postReviewPlato:", error);
    return { success: false, error: error.message };
  }
};