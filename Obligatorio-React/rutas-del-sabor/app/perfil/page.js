"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLocals, postLocal, postPlato } from "../../services/apirestaurante";
import AdminPerfilComponent from "../../components/AdminPerfilComponent";

export default function PerfilPage() {
  const [user, setUser] = useState(null);
  const [localesParaSelect, setLocalesParaSelect] = useState([]); 
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const cargarConfiguracion = async () => {
    try {
      const allLocals = await getLocals();
      setLocalesParaSelect(allLocals);
    } catch (e) {
      console.error("Error al cargar locales para el formulario:", e);
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
    cargarConfiguracion();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  // --- FUNCIONES DE ALTA CON INYECCIÓN DE USUARIO ---
  const alGuardarLocal = async (nuevo) => {
    try {
      // Importante: Agregamos el autor del localStorage al objeto antes de enviarlo
      const localConAutor = { 
        ...nuevo, 
        creadoPor: user.username,
        autorLocal: user.username 
      };

      await postLocal(localConAutor);
      alert(`✅ Local creado con éxito por ${user.username}`);
      cargarConfiguracion(); 
    } catch (error) {
      console.error("Error API Local:", error);
      alert("Error al crear local. Revisa la consola.");
    }
  };

  const alGuardarPlato = async (nuevo) => {
    try {
      // Importante: Agregamos el autor del localStorage al objeto antes de enviarlo
      const platoConAutor = { 
        ...nuevo, 
        creadoPor: user.username,
        autorPlato: user.username 
      };

      await postPlato(platoConAutor);
      alert(`✅ Plato añadido con éxito por ${user.username}`);
    } catch (error) {
      console.error("Error API Plato:", error);
      alert("Error al crear plato. Revisa la consola.");
    }
  };

  if (loading || !user) return <div style={msgStyle}>Cargando panel de carga...</div>;

  return (
    <div style={container}>
      <header style={header}>
        <button onClick={() => router.push('/')} style={backBtn}>🏠 Inicio</button>
        <button onClick={() => router.push('/rutas')} style={viewBtn}>📍 Ver Mis Rutas</button>
      </header>

      <h1 style={titleStyle}>👤 Panel de Carga</h1>

      {/* TARJETA DE USUARIO */}
      <div style={card}>
        <div style={avatarCircle}>{user.username.charAt(0).toUpperCase()}</div>
        <div style={infoGroup}>
          <p style={label}>Usuario Logueado</p>
          <p style={value}>{user.username}</p>
        </div>
        <button onClick={handleLogout} style={logoutBtn}>Cerrar Sesión</button>
      </div>

      <hr style={divider} />

      {/* FORMULARIOS DE ALTA */}
      <div style={formSection}>
        <h2 style={sectionTitle}>Añadir Nuevo Contenido</h2>
        <AdminPerfilComponent 
          localesExistentes={localesParaSelect}
          alGuardarLocal={alGuardarLocal}
          alGuardarPlato={alGuardarPlato}
        />
      </div>
      
      <p style={footerNote}>Los datos se guardarán vinculados a tu usuario en Railway</p>
    </div>
  );
}

// --- ESTILOS ---
const container = { padding: "40px 20px", maxWidth: "600px", margin: "0 auto", minHeight: "100vh", backgroundColor: "#f8f9fa" };
const header = { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' };
const card = { padding: "25px", borderRadius: "20px", background: "#ffffff", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", textAlign: "center" };
const avatarCircle = { width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "#e67e22", color: "white", fontSize: "20px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" };
const titleStyle = { color: '#2c3e50', fontSize: '26px', fontWeight: '800', textAlign: 'center', marginBottom: '25px' };
const infoGroup = { textAlign: "left", marginBottom: "10px" };
const label = { fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", fontWeight: "bold" };
const value = { fontSize: "16px", color: "#1e293b", fontWeight: '600' };
const backBtn = { background: "#f1f5f9", border: "none", color: "#64748b", padding: '8px 15px', borderRadius: '10px', cursor: "pointer", fontWeight: "bold" };
const viewBtn = { background: "#fff3e0", border: "none", color: "#e67e22", padding: '8px 15px', borderRadius: '10px', cursor: "pointer", fontWeight: "bold" };
const logoutBtn = { marginTop: "10px", padding: "6px", borderRadius: "8px", border: "1px solid #fee2e2", color: "#ef4444", background: "none", cursor: "pointer", fontSize: '12px' };
const divider = { border: 'none', height: '1px', backgroundColor: '#e2e8f0', margin: '30px 0' };
const formSection = { marginBottom: '40px' };
const sectionTitle = { fontSize: '18px', color: '#1e293b', marginBottom: '15px', fontWeight: '700', textAlign: 'center' };
const footerNote = { textAlign: 'center', fontSize: '11px', color: '#cbd5e1', marginTop: '30px' };
const msgStyle = { textAlign: "center", marginTop: "100px", color: "#64748b" };