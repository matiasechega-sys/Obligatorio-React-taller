"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getLocals } from "../services/apirestaurante";
import ListadoPrincipal from "../components/ListadoPrincipal";
import SesionPanel from "../components/SesionPanel";

export default function HomePage() {
  const [locales, setLocales] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const cargarDatos = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getLocals();
      setLocales(data);
    } catch (error) {
      console.error("Error al cargar locales:", error);
      setLocales([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/register");
    } else {
      cargarDatos();
    }
  }, [router, cargarDatos]);

  // FILTRO DE BÚSQUEDA
  const filtrados = locales.filter((l) => {
    const term = filtro.toLowerCase().trim();
    if (!term) return true;

    const nombre = String(l.name || l.nombre || "").toLowerCase();
    const zona = String(l.zone || l.barrio || "").toLowerCase();
    const tipo = String(l.type || l.tipo || "").toLowerCase();
    const precio = String(l.priceRange || l.precio || "").toLowerCase();
    const puntuacion = String(l.rating || "");
    const horas = String(l.hours || "").toLowerCase();

    return (
      nombre.includes(term) ||
      zona.includes(term) ||
      tipo.includes(term) ||
      precio.includes(term) ||
      puntuacion === term ||
      horas.includes(term)
    );
  });

  if (loading)
    return (
      <div style={loaderStyle}>
        Sincronizando con la Ruta del Sabor...
      </div>
    );

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        minHeight: "100vh",
        position: "relative"
      }}
    >
      
      {/* PANEL DE SESIÓN */}
      <SesionPanel />

      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1
          style={{
            color: "#2c3e50",
            fontSize: "36px",
            fontWeight: "800",
            marginBottom: "10px",
          }}
        >
          📍 Mis Rutas
        </h1>

        <p style={{ color: "#7f8c8d", marginBottom: "20px" }}>
          {locales.length === 0
            ? "Aún no tienes locales guardados."
            : `Tienes ${locales.length} locales en tu lista.`}
        </p>

        {/* BUSCADOR */}
        <div
          style={{
            position: "relative",
            display: "inline-block",
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <input
            placeholder="Busca por nombre, barrio, tipo o puntuación (1-5)..."
            style={searchStyle}
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />

          {filtro && (
            <button
              onClick={() => setFiltro("")}
              style={clearButtonStyle}
            >
              ✕
            </button>
          )}
        </div>

        {filtro && (
          <p
            style={{
              marginTop: "15px",
              color: "#e67e22",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            🔍 Coincidencias: {filtrados.length}
          </p>
        )}
      </div>

      {/* LISTADO DE LOCALES */}
      <ListadoPrincipal locales={filtrados} />

      {/* BOTÓN REFRESH */}
      <div
        style={{
          textAlign: "center",
          marginTop: "60px",
          paddingBottom: "40px",
        }}
      >
        <button onClick={cargarDatos} style={refreshButtonStyle}>
          🔄 ¿No aparece tu local nuevo? Click para actualizar
        </button>
      </div>
    </div>
  );
}

/* ESTILOS */

const loaderStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "70vh",
  fontSize: "18px",
  color: "#e67e22",
  fontWeight: "bold",
};

const searchStyle = {
  width: "100%",
  padding: "16px 25px",
  borderRadius: "50px",
  border: "2px solid #f1f5f9",
  outline: "none",
  fontSize: "16px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
};

const clearButtonStyle = {
  position: "absolute",
  right: "20px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  color: "#cbd5e1",
  cursor: "pointer",
  fontSize: "18px",
};

const refreshButtonStyle = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#64748b",
  padding: "10px 20px",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "13px",
};