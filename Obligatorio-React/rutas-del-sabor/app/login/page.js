"use client";
import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert("¡Ingreso exitoso!");
        localStorage.setItem('token', data.token);
        window.location.href = "/"; 
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("No se pudo conectar con la API.");
    }
  };

  return (
    <div style={pageContainer}>
      <div style={cardStyle}>
        <div style={iconContainer}>🍕</div>
        <h1 style={titleStyle}>¡Bienvenido!</h1>
        <p style={subtitleStyle}>Ingresa tus credenciales para continuar</p>
        
        <form onSubmit={handleLogin} style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>Nombre de Usuario</label>
            <input 
              type="text" 
              placeholder="Tu usuario" 
              required 
              value={username}
              onChange={e => setUsername(e.target.value)}
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
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button 
            type="submit" 
            style={buttonStyle}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Entrar
          </button>
        </form>

        <p style={footerTextStyle}>
          ¿Aún no tienes cuenta? <a href="/register" style={linkStyle}>Crea una aquí</a>
        </p>
      </div>
    </div>
  );
}

// --- ESTILOS PARECIDOS AL REGISTER ---
const pageContainer = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '80vh'
};

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '40px',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)', // Sombra suave igual al register
  width: '100%',
  maxWidth: '400px',
  textAlign: 'center'
};

const iconContainer = { fontSize: '45px', marginBottom: '10px' };

const titleStyle = {
  color: '#2c3e50',
  fontSize: '26px',
  margin: '0 0 8px 0',
  fontWeight: '800'
};

const subtitleStyle = {
  color: '#95a5a6',
  fontSize: '14px',
  marginBottom: '30px',
  lineHeight: '1.4'
};

const formStyle = { display: 'flex', flexDirection: 'column', gap: '18px' };

const inputGroup = {
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const labelStyle = {
  fontSize: '12px',
  fontWeight: '700',
  color: '#e67e22', // Naranja del register
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const inputStyle = {
  padding: '12px 16px',
  borderRadius: '10px',
  border: '2px solid #f1f2f6',
  fontSize: '15px',
  outline: 'none',
  backgroundColor: '#f9f9f9',
  transition: 'all 0.3s ease'
};

const buttonStyle = {
  padding: '14px',
  background: '#e67e22',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px',
  marginTop: '10px',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 12px rgba(230, 126, 34, 0.3)'
};

const footerTextStyle = {
  marginTop: '25px',
  fontSize: '14px',
  color: '#7f8c8d'
};

const linkStyle = {
  color: '#2c3e50',
  textDecoration: 'none',
  fontWeight: 'bold',
  borderBottom: '2px solid #e67e22'
};