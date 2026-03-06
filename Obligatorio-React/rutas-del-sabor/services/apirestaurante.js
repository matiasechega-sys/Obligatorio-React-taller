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
    
    // 1. Intentamos traer datos de la API
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

    // 2. Traemos lo que hayamos guardado manualmente en el navegador
    const localesLocales = JSON.parse(localStorage.getItem("mis_locales_propios") || "[]");

    // 3. Combinamos ambos (evitando duplicados por nombre)
    const combinados = [...localesLocales, ...listaApi];
    
    // Quitamos duplicados simples para que no se repitan en el inicio
    const unicos = combinados.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);

    return unicos;
  } catch (error) {
    console.error("Error en getLocals, usando backup local:", error);
    return JSON.parse(localStorage.getItem("mis_locales_propios") || "[]");
  }
};

// --- POST LOCAL (HÍBRIDO: GUARDA EN API Y EN NAVEGADOR) ---
export const postLocal = async (localData) => {
  try {
    // A. GUARDAR EN EL NAVEGADOR (Para que siempre puedas filtrar)
    const actuales = JSON.parse(localStorage.getItem("mis_locales_propios") || "[]");
    const nuevaLista = [localData, ...actuales];
    localStorage.setItem("mis_locales_propios", JSON.stringify(nuevaLista));

    // B. GUARDAR EN LA API (Como ya lo tenías)
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
    
    return data;
  } catch (error) {
    console.error("Error en postLocal:", error);
    // Aunque falle la API, devolvemos éxito porque ya se guardó en el navegador
    return { success: true, note: "Guardado localmente" };
  }
};