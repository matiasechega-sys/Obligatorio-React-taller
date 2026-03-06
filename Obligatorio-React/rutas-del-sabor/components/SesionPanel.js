"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SesionPanel() {

  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const irPerfil = () => {
    router.push("/perfil"); // ✅ SIN ID
  };

  if (!user) return null;

  return (
    <div style={containerStyle}>

      <button
        onClick={irPerfil}
        style={perfilButton}
      >
        👤 {user.username || "Mi Perfil"}
      </button>

    </div>
  );
}

const containerStyle = {
  position: "absolute",
  top: "20px",
  right: "20px"
};

const perfilButton = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "10px 18px",
  cursor: "pointer",
  fontWeight: "600",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
};