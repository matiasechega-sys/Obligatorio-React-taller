"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLocals, getPlatos } from "../../services/apirestaurante";
import ListadoPrincipal from "../../components/ListadoPrincipal";

export default function MisRutasPage() {
  const [user, setUser] = useState(null);
  const [datos, setDatos] = useState({ locales: [], platos: [] });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

 const cargarDatosPropios = async (username) => {
  try {
    setLoading(true);
    const [allLocals, allPlatos] = await Promise.all([getLocals(), getPlatos()]);
    
    // Normalizamos el nombre del usuario logueado
    const miNombre = username.trim().toLowerCase();

    const filtrados = {
      locales: allLocals.filter(l => {
        // Normalizamos el autor del local que viene de la API
        const autorL = (l.creadoPor || l.autorLocal || l.autor || "").toString().trim().toLowerCase();
        return autorL === miNombre;
      }),
      platos: allPlatos.filter(p => {
        // Normalizamos el autor del plato que viene de la API
        const autorP = (p.autorPlato || p.creadoPor || p.autor || "").toString().trim().toLowerCase();
        return autorP === miNombre;
      })
    };
    
    setDatos(filtrados);
  } catch (e) {
    console.error("Error al filtrar rutas:", e);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    cargarDatosPropios(parsedUser.username);
  }, [router]);

  if (loading) return <div style={msgStyle}>Cargando tus aportes...</div>;

  return (
    <div style={container}>
      {/* HEADER */}
      <header style={header}>
        <div style={navRow}>
          {/* Alineado a la derecha prolijamente */}
          <button onClick={() => router.push('/')} style={homeBtn}>🏠 Ir al Inicio</button>
        </div>
        <h1 style={title}>📍 Mis Rutas Creadas</h1>
        <p style={subtitle}>Gestiona el contenido que has subido a la plataforma</p>
      </header>

      {/* RESUMEN DE ESTADÍSTICAS */}
      <div style={statsRow}>
        <div style={statCard}>
          <span style={statNumber}>{datos.locales.length}</span>
          <span style={statLabel}>Locales</span>
        </div>
        <div style={statCard}>
          <span style={statNumber}>{datos.platos.length}</span>
          <span style={statLabel}>Platos</span>
        </div>
      </div>

      {/* SECCIONES DE LISTADO */}
      <div style={contentSection}>
        <div style={sectionHeader}>
          <h2 style={sectionTitle}>🏢 Mis Locales Registrados</h2>
          {datos.locales.length === 0 && <p style={emptyMsg}>Aún no has registrado locales.</p>}
        </div>
        <ListadoPrincipal datos={datos.locales} tipo="locales" />
        
        <div style={divider}></div>
        
        <div style={sectionHeader}>
          <h2 style={sectionTitle}>🍲 Mis Platos Publicados</h2>
          {datos.platos.length === 0 && <p style={emptyMsg}>Aún no has registrado platos.</p>}
        </div>
        <ListadoPrincipal datos={datos.platos} tipo="platos" />
      </div>

      <footer style={footer}>
        Sesión iniciada como: <strong>{user?.username}</strong>
      </footer>
    </div>
  );
}

// --- ESTILOS ACTUALIZADOS ---
const container = { padding: "40px 20px", maxWidth: "1100px", margin: "0 auto", backgroundColor: "#f8f9fa", minHeight: "100vh" };
const header = { marginBottom: "40px", textAlign: 'center' };

// Ajustado para que el botón de inicio se vea bien solo
const navRow = { 
  display: 'flex', 
  justifyContent: 'flex-end', 
  alignItems: 'center', 
  marginBottom: '20px' 
};

const title = { fontSize: "32px", color: "#2c3e50", fontWeight: "900", margin: '10px 0 5px' };
const subtitle = { color: "#64748b", fontSize: '16px' };

const statsRow = { display: "flex", gap: "20px", justifyContent: "center", marginBottom: "40px" };
const statCard = { 
  background: "white", padding: "20px", borderRadius: "20px", 
  boxShadow: "0 4px 15px rgba(0,0,0,0.05)", textAlign: 'center', minWidth: '140px',
  border: '1px solid #edf2f7'
};
const statNumber = { display: 'block', fontSize: '28px', fontWeight: '900', color: '#e67e22' };
const statLabel = { fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' };

const contentSection = { background: 'white', padding: '30px', borderRadius: '30px', boxShadow: '0 2px 20px rgba(0,0,0,0.02)' };
const sectionHeader = { marginBottom: '20px' };
const sectionTitle = { fontSize: "22px", color: "#2c3e50", borderLeft: "5px solid #e67e22", paddingLeft: "15px", fontWeight: '800' };
const emptyMsg = { color: '#94a3b8', fontSize: '14px', marginTop: '10px', fontStyle: 'italic' };
const divider = { height: '50px' };

const homeBtn = { background: "#f1f5f9", border: "none", color: "#64748b", padding: '10px 20px', borderRadius: '12px', cursor: "pointer", fontWeight: "bold", transition: '0.2s' };
const msgStyle = { textAlign: "center", marginTop: "100px", color: "#64748b", fontSize: '18px' };
const footer = { textAlign: 'center', marginTop: '40px', fontSize: '12px', color: '#cbd5e1' };