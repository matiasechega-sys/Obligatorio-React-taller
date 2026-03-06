"use client";

import { useEffect, useState } from "react";

export default function PerfilPage() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const storedUser = localStorage.getItem("user");
    const storedEmail = localStorage.getItem("registerEmail");

    if (storedUser) {

      const parsedUser = JSON.parse(storedUser);

      // si el usuario no tiene email desde la API, usamos el guardado local
      if (!parsedUser.email && storedEmail) {
        parsedUser.email = storedEmail;
      }

      setUser(parsedUser);
    }

  }, []);

  if (!user) return <p style={{ padding: "40px" }}>Cargando perfil...</p>;

  return (
    <div style={container}>
      <h1>👤 Mi Perfil</h1>

      <div style={card}>
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Usuario:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email || "No disponible"}</p>
      </div>
    </div>
  );
}

const container = {
  padding: "40px",
  maxWidth: "800px",
  margin: "0 auto"
};

const card = {
  marginTop: "20px",
  padding: "25px",
  borderRadius: "12px",
  background: "#ffffff",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
};