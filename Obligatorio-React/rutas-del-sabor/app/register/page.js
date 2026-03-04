"use client"; // Siempre arriba para poder usar estados
import { useState } from 'react';

export default function RegisterPage() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const manejarRegistro = (e) => {
    e.preventDefault();
    console.log("Registrando:", { usuario, password });
    alert("Usuario creado con éxito");
    // Aquí podrías redirigir al login
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h1>Registro 📝</h1>
      <form onSubmit={manejarRegistro} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Elige un nombre de usuario" 
          onChange={(e) => setUsuario(e.target.value)}
          required 
          style={{ padding: '8px' }}
        />
        <input 
          type="password" 
          placeholder="Crea una contraseña" 
          onChange={(e) => setPassword(e.target.value)}
          required 
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
          Registrarse
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
      </p>
    </div>
  );
}