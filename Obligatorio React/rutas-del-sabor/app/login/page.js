"use client"; // Siempre arriba para poder usar estados
import { useState } from 'react';

export default function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const manejarLogin = (e) => {
    e.preventDefault();
    console.log("Iniciando sesión con:", { usuario, password });
    
    // Simulación de login exitoso
    alert("¡Bienvenido de nuevo!");
    
    // Redirigir a la página principal (donde estarán los locales)
    window.location.href = '/';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h1>Iniciar Sesión 🔑</h1>
      <form onSubmit={manejarLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Nombre de usuario" 
          onChange={(e) => setUsuario(e.target.value)}
          required 
          style={{ padding: '8px' }}
        />
        <input 
          type="password" 
          placeholder="Tu contraseña" 
          onChange={(e) => setPassword(e.target.value)}
          required 
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
      </p>
    </div>
  );
}