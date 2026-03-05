"use client";
import { useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ 
    username: '', 
    name: '', 
    password: '' 
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("¡Cuenta creada con éxito! Bienvenido a bordo.");
        window.location.href = "/login"; 
      } else {
        const errorData = await res.json();
        alert("Error: " + (errorData.error || "No se pudo realizar el registro"));
      }
    } catch (err) {
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <div style={pageContainer}>
      <div style={cardStyle}>
        <div style={iconContainer}>🍕</div>
        <h1 style={titleStyle}>Únete a la Ruta</h1>
        <p style={subtitleStyle}>Crea tu cuenta y descubre nuevos sabores</p>
        
        <form onSubmit={handleRegister} style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>Nombre Completo</label>
            <input 
              type="text" 
              placeholder="Ej: Ana Pereira" 
              required 
              onChange={e => setFormData({...formData, name: e.target.value})}
              style={inputStyle}
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Nombre de Usuario</label>
            <input 
              type="text" 
              placeholder="Tu usuario favorito" 
              required 
              onChange={e => setFormData({...formData, username: e.target.value})}
              style={inputStyle}
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Contraseña</label>
            <input 
              type="password" 
              placeholder="Mínimo 6 caracteres" 
              required 
              onChange={e => setFormData({...formData, password: e.target.value})}
              style={inputStyle}
            />
          </div>

          <button 
            type="submit" 
            style={buttonStyle}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Registrarse ahora
          </button>
        </form>

        <p style={footerTextStyle}>
          ¿Ya eres parte? <a href="/login" style={linkStyle}>Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}

// --- ESTILOS MODERNOS ---
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
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
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
  color: '#e67e22',
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