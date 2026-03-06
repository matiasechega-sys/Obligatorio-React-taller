"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PerfilPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedEmail = localStorage.getItem("registerEmail");
    const token = localStorage.getItem("token");

    // Si no hay token, lo mandamos al login (Protección de ruta)
    if (!token) {
      router.push("/login");
      return;
    }

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Si el usuario no tiene email desde la API, usamos el guardado local
      if (!parsedUser.email && storedEmail) {
        parsedUser.email = storedEmail;
      }
      setUser(parsedUser);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (!user) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Cargando perfil...</p>
    </div>
  );

  return (
    <div style={container}>
      <button onClick={() => router.push('/')} style={backBtn}>← Volver</button>
      
      <h1 style={titleStyle}>👤 Mi Perfil</h1>

      <div style={card}>
        <div style={avatarCircle}>
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div style={infoGroup}>
          <p style={label}>ID de Usuario</p>
          <p style={value}>#{user.id}</p>
        </div>
        <div style={infoGroup}>
          <p style={label}>Nombre de Usuario</p>
          <p style={value}>{user.username}</p>
        </div>
        <div style={infoGroup}>
          <p style={label}>Correo Electrónico</p>
          <p style={value}>{user.email || "No disponible"}</p>
        </div>

        <button onClick={handleLogout} style={logoutBtn}>Cerrar Sesión</button>
      </div>
    </div>
  );
}

// --- ESTILOS ---
const container = {
  padding: "40px",
  maxWidth: "500px",
  margin: "0 auto",
  minHeight: "100vh",
  backgroundColor: "#f8f9fa"
};

const card = {
  marginTop: "20px",
  padding: "30px",
  borderRadius: "20px",
  background: "#ffffff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  textAlign: "center"
};

const avatarCircle = {
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  backgroundColor: "#e67e22",
  color: "white",
  fontSize: "32px",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 20px"
};

const infoGroup = {
  textAlign: "left",
  marginBottom: "15px",
  borderBottom: "1px solid #f1f2f6",
  paddingBottom: "10px"
};

const label = { fontSize: "12px", color: "#95a5a6", textTransform: "uppercase", fontWeight: "bold", margin: 0 };
const value = { fontSize: "16px", color: "#2c3e50", margin: "5px 0 0 0", fontWeight: "500" };
const titleStyle = { color: '#2c3e50', fontSize: '28px', fontWeight: '800', textAlign: 'center' };
const backBtn = { background: "none", border: "none", color: "#e67e22", cursor: "pointer", fontWeight: "bold", marginBottom: "10px" };
const logoutBtn = { marginTop: "20px", width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e74c3c", color: "#e74c3c", background: "none", cursor: "pointer", fontWeight: "bold" };