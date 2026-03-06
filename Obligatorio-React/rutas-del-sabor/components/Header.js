"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadUser = () => {
      const userData = localStorage.getItem('user');
      if (userData && userData !== "undefined" && userData !== "null") {
        try { setUser(JSON.parse(userData)); } catch (e) { localStorage.removeItem('user'); }
      }
    };
    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/";
  };

  if (!mounted) return <nav style={{ height: '75px' }}></nav>;

  return (
    <nav style={navStyle}>
      <div style={navContainer}>
        <Link href="/" style={{ textDecoration: 'none', color: '#e67e22', fontWeight: '800', fontSize: '22px' }}>
          📍 Rutas del Sabor
        </Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/" style={linkStyle}>Inicio</Link>
          {user ? (
            <>
              <Link href="/Locales" style={linkStyle}>Locales</Link>
              <Link href="/Platos" style={linkStyle}>Platos</Link>
              <span style={{ fontSize: '14px' }}>Hola, {user.name || 'Usuario'}</span>
              <button onClick={handleLogout} style={logoutButtonStyle}>Salir</button>
            </>
          ) : (
            <Link href="/login" style={linkStyle}>Ingresar</Link>
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