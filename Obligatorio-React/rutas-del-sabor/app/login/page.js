"use client";

import { useState } from "react";
import { login } from "@/services/apirestaurante";

export default function LoginPage() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = await login(username.trim(), password);

    // 🔹 CAMBIO AQUÍ: Verificamos si existe data y token, NO data.success
    if (data && data.token) {
      
      // Recuperar email guardado (opcional, por si lo necesitas)
      const email = localStorage.getItem("registerEmail");
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

      const userWithEmail = {
        ...currentUser,
        email: email
      };

      localStorage.setItem("user", JSON.stringify(userWithEmail));

      // Éxito real: Redirigimos
      window.location.href = "/";

    } else {
      // Si llegamos acá es porque realmente hubo un error
      alert("Error: " + (data.error || "Usuario o contraseña incorrectos"));
    }

    setLoading(false);
  };
  return (
    <div style={pageContainer}>
      <div style={cardStyle}>

        <div style={iconContainer}>🍕</div>

        <h1 style={titleStyle}>¡Bienvenido!</h1>
        <p style={subtitleStyle}>Ingresa tus credenciales para continuar</p>

        <form onSubmit={handleLogin} style={formStyle}>

          <div style={inputGroup}>
            <label style={labelStyle}>Usuario</label>
            <input
              type="text"
              placeholder="Tu usuario"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Verificando..." : "Entrar"}
          </button>

        </form>

        <p style={footerTextStyle}>
          ¿Aún no tienes cuenta?{" "}
          <a href="/register" style={linkStyle}>
            Crea una aquí
          </a>
        </p>

      </div>
    </div>
  );
}

const pageContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "80vh",
  backgroundColor: "#f8f9fa"
};

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  width: "100%",
  maxWidth: "400px",
  textAlign: "center"
};

const iconContainer = {
  fontSize: "45px",
  marginBottom: "10px"
};

const titleStyle = {
  color: "#2c3e50",
  fontSize: "26px",
  fontWeight: "800",
  margin: "0 0 8px 0"
};

const subtitleStyle = {
  color: "#95a5a6",
  fontSize: "14px",
  marginBottom: "30px"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "18px"
};

const inputGroup = {
  textAlign: "left",
  display: "flex",
  flexDirection: "column",
  gap: "6px"
};

const labelStyle = {
  fontSize: "12px",
  fontWeight: "700",
  color: "#e67e22",
  textTransform: "uppercase"
};

const inputStyle = {
  padding: "12px",
  borderRadius: "10px",
  border: "2px solid #f1f2f6",
  outline: "none",
  backgroundColor: "#f9f9f9",
  fontSize: "16px"
};

const buttonStyle = {
  padding: "14px",
  background: "#e67e22",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
  marginTop: "10px"
};

const footerTextStyle = {
  marginTop: "25px",
  fontSize: "14px",
  color: "#7f8c8d"
};

const linkStyle = {
  color: "#2c3e50",
  textDecoration: "none",
  fontWeight: "bold",
  borderBottom: "2px solid #e67e22"
};