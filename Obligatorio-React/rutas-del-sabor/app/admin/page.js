"use client";
import { useState } from 'react';

export default function AdminPage() {
  const [form, setForm] = useState({
    name: '',
    type: 'restaurante',
    priceRange: 'medio',
    city: 'Montevideo',
    zone: '',
    address: '',
    hours: '',
    photos: ['🍽️']
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const res = await fetch('/api/locals', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert("¡Local creado con éxito!");
      window.location.href = "/"; // Volver al inicio para verlo
    } else {
      const data = await res.json();
      alert("Error: " + (data.error || "No autorizado. Inicia sesión primero."));
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>📍 Registrar Local</h1>
        <p style={subtitleStyle}>Completa los datos para la nueva ruta</p>
        
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={groupStyle}>
            <label style={labelStyle}>Nombre del Local</label>
            <input required style={inputStyle} placeholder="Ej: Cafe Central" 
              onChange={e => setForm({...form, name: e.target.value})} />
          </div>

          <div style={{display: 'flex', gap: '10px'}}>
            <div style={{flex: 1}}>
              <label style={labelStyle}>Tipo</label>
              <select style={inputStyle} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="restaurante">Restaurante</option>
                <option value="cafeteria">Cafetería</option>
                <option value="bar">Bar</option>
                <option value="food truck">Food Truck</option>
              </select>
            </div>
            <div style={{flex: 1}}>
              <label style={labelStyle}>Precio</label>
              <select style={inputStyle} onChange={e => setForm({...form, priceRange: e.target.value})}>
                <option value="economico">Económico</option>
                <option value="medio">Medio</option>
                <option value="alto">Alto</option>
              </select>
            </div>
          </div>

          <div style={groupStyle}>
            <label style={labelStyle}>Zona / Ciudad</label>
            <input required style={inputStyle} placeholder="Ej: Pocitos, Montevideo" 
              onChange={e => setForm({...form, zone: e.target.value})} />
          </div>

          <div style={groupStyle}>
            <label style={labelStyle}>Dirección y Horarios</label>
            <input style={inputStyle} placeholder="Av. 18 de Julio 1234" 
              onChange={e => setForm({...form, address: e.target.value})} />
            <input style={{...inputStyle, marginTop: '10px'}} placeholder="08:00 - 20:00" 
              onChange={e => setForm({...form, hours: e.target.value})} />
          </div>

          <button type="submit" style={buttonStyle}>Publicar Local</button>
        </form>
      </div>
    </div>
  );
}

// Estilos consistentes con tu diseño
const containerStyle = { display: 'flex', justifyContent: 'center', padding: '20px' };
const cardStyle = { background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '500px' };
const titleStyle = { color: '#2c3e50', fontSize: '24px', textAlign: 'center', margin: '0' };
const subtitleStyle = { color: '#7f8c8d', textAlign: 'center', marginBottom: '30px', fontSize: '14px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const groupStyle = { display: 'flex', flexDirection: 'column', gap: '5px' };
const labelStyle = { fontSize: '12px', fontWeight: 'bold', color: '#e67e22', textTransform: 'uppercase' };
const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #f1f2f6', backgroundColor: '#f9f9f9', outline: 'none' };
const buttonStyle = { padding: '15px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' };