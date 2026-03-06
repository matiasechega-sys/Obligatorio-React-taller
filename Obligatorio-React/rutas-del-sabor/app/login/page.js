"use client";
import { useState } from 'react';
import { login } from '../../services/apirestaurante';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = await login(username.trim(), password);

      console.log("Datos recibidos de la API:", data);

      if (data && data.token) {
        // 1. Guardamos el token
        localStorage.setItem("token", data.token);
        
        // 2. ARREGLO PARA EL "NO EXISTO":
        // Si la API no manda el objeto user, creamos uno básico con el username
        // para que el layout.js pueda mostrar "Hola, usuario"
        const sessionUser = data.user || { username: username.trim(), name: username.trim() };
        localStorage.setItem("user", JSON.stringify(sessionUser));
        
        alert("¡Ingreso exitoso!");
        
        // 3. Forzamos recarga total para que el RootLayout lea los datos nuevos
        window.location.href = "/"; 
      } else {
        alert("Error de acceso: " + (data?.error || "Credenciales incorrectas"));
      }
    } catch (err) {
      console.error("Error crítico:", err);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
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
            disabled={loading}
            style={loading ? {...buttonStyle, opacity: 0.7, cursor: 'not-allowed'} : buttonStyle}
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>

        <p style={footerTextStyle}>
          ¿Aún no tienes cuenta? <a href="/register" style={linkStyle}>Crea una aquí</a>
        </p>
      </div>
    </div>
  );
}

// Estilos (Mantenemos tus constantes que están perfectas)
const pageContainer = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' };
const cardStyle = { backgroundColor: '#ffffff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px', textAlign: 'center' };
const iconContainer = { fontSize: '45px', marginBottom: '10px' };
const titleStyle = { color: '#2c3e50', fontSize: '26px', margin: '0 0 8px 0', fontWeight: '800' };
const subtitleStyle = { color: '#95a5a6', fontSize: '14px', marginBottom: '30px', lineHeight: '1.4' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '18px' };
const inputGroup = { textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { fontSize: '12px', fontWeight: '700', color: '#e67e22', textTransform: 'uppercase', letterSpacing: '0.5px' };
const inputStyle = { padding: '12px 16px', borderRadius: '10px', border: '2px solid #f1f2f6', fontSize: '15px', outline: 'none', backgroundColor: '#f9f9f9' };
const buttonStyle = { padding: '14px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px', boxShadow: '0 4px 12px rgba(230, 126, 34, 0.3)' };
const footerTextStyle = { marginTop: '25px', fontSize: '14px', color: '#7f8c8d' };
const linkStyle = { color: '#2c3e50', textDecoration: 'none', fontWeight: 'bold', borderBottom: '2px solid #e67e22' };