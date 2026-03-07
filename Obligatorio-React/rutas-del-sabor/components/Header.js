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
              {/* MANTENEMOS: Acceso a la página de Mis Rutas */}
              <Link href="/rutas" style={misRutasLinkStyle}>
                Mis Rutas
              </Link>

              {/* BORRADO: El acceso al Panel de Carga (Perfil) ya no está aquí */}
              
              <span style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>
                Hola, {user.username || 'Usuario'}
              </span>
              
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

const linkStyle = { 
  color: '#64748b', 
  textDecoration: 'none', 
  fontSize: '15px', 
  fontWeight: '600', 
  transition: 'color 0.2s ease' 
};

const misRutasLinkStyle = {
  ...linkStyle,
  color: '#e67e22', 
  backgroundColor: '#fff3e0',
  padding: '6px 12px',
  borderRadius: '8px',
  fontSize: '14px'
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