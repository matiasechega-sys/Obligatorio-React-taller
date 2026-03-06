// components/Header.js
"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem('user');
      
      if (userData && userData !== "undefined" && userData !== "null") {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error al parsear usuario:", error);
          localStorage.removeItem('user');
        }
      }
    };

    loadUser();
    // Escuchamos cambios en localStorage por si el login ocurre en otra pestaña
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Borramos todo (token y user)
    setUser(null);
    window.location.href = "/"; // Redirigimos al inicio
  };

  // Lógica para mostrar el nombre del usuario
  const displayName = user ? (user.name || user.username || (user.user && user.user.name) || "Usuario") : "";

  return (
    <nav style={navStyle}>
      <div style={navContainer}>
        {/* LOGO */}
        <Link href="/" style={logoStyle}>
          <span style={{ fontSize: '24px' }}>📍</span> 
          <span style={logoTextStyle}>Rutas del Sabor</span>
        </Link>
        
        {/* LINKS DE NAVEGACIÓN */}
        <div style={navLinksStyle}>
          <Link href="/" style={linkStyle}>Inicio</Link>
          
          {/* Si hay usuario, mostramos acceso a Admin */}
          {user && <Link href="/admin" style={linkStyle}>Locales</Link>}
          
          {!user ? (
            <>
              <Link href="/login" style={linkStyle}>Ingresar</Link>
              <Link href="/register" style={registerButtonStyle}>Registrarse</Link>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={welcomeStyle}>
                Hola, <strong>{displayName}</strong>
              </span>
              <button onClick={handleLogout} style={logoutButtonStyle}>Salir</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

// --- ESTILOS ---
const navStyle = { 
  backgroundColor: '#ffffff', 
  height: '75px', 
  width: '100%',
  display: 'flex', 
  alignItems: 'center', 
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
  position: 'sticky', 
  top: 0, 
  zIndex: 1000 
};

const navContainer = { 
  width: '100%', 
  maxWidth: '1100px', 
  margin: '0 auto', 
  padding: '0 20px', 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center' 
};

const logoStyle = { 
  textDecoration: 'none', 
  display: 'flex', 
  alignItems: 'center', 
  gap: '8px' 
};

const logoTextStyle = { 
  color: '#e67e22', 
  fontSize: '22px', 
  fontWeight: '800', 
  letterSpacing: '-0.5px' 
};

const navLinksStyle = { 
  display: 'flex', 
  alignItems: 'center', 
  gap: '25px' 
};

const linkStyle = { 
  color: '#64748b', 
  textDecoration: 'none', 
  fontSize: '15px', 
  fontWeight: '600', 
  transition: 'color 0.2s ease' 
};

const registerButtonStyle = { 
  backgroundColor: '#e67e22', 
  color: '#ffffff', 
  padding: '10px 20px', 
  borderRadius: '12px', 
  textDecoration: 'none', 
  fontSize: '14px', 
  fontWeight: 'bold',
  transition: 'transform 0.2s'
};

const welcomeStyle = { 
  fontSize: '14px', 
  color: '#334155' 
};

const logoutButtonStyle = { 
  backgroundColor: '#f1f5f9', 
  color: '#64748b', 
  border: 'none', 
  padding: '8px 15px', 
  borderRadius: '8px', 
  cursor: 'pointer', 
  fontSize: '13px', 
  fontWeight: 'bold',
  transition: 'background 0.2s'
};