"use client";
import { useState } from 'react';
import { postLocal } from '../services/apirestaurante';

export default function AltaLocalesComponent() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: 'restaurante',
    priceRange: 'medio', 
    zone: '',
    address: '',
    photos: '',
    rating: '5',        // Requisito: Puntuación
    hours: '09:00 - 23:00' // Requisito: Horario
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      name: form.name.trim(),
      type: form.type,
      priceRange: form.priceRange,
      zone: form.zone.trim(),
      address: form.address.trim(),
      rating: Number(form.rating), // Lo enviamos como número para el filtro
      hours: form.hours.trim(),
      photos: [form.photos.trim() || "https://via.placeholder.com/300"]
    };

    try {
      const data = await postLocal(payload);
      if (data && !data.error) {
        alert("✅ ¡Local creado con éxito!");
        window.location.assign('/'); 
      } else {
        alert(`❌ Error: ${data.error || "No se pudo crear el local"}`);
      }
    } catch (err) {
      console.error("Error en la petición:", err);
      alert("🚨 Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={iconContainer}>🍕</div>
      <h2 style={titleStyle}>Registrar Nuevo Local</h2>
      <p style={subtitleStyle}>Completa los datos para la nueva Ruta del Sabor</p>

      <form onSubmit={handleSubmit} style={formStyle}>
        
        {/* NOMBRE */}
        <div style={inputGroup}>
          <label style={labelStyle}>Nombre del Local</label>
          <input 
            placeholder="Ej: La Pasiva" required style={inputStyle} 
            value={form.name} onChange={e => setForm({...form, name: e.target.value})} 
          />
        </div>
        
        {/* TIPO Y PRECIO */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1, ...inputGroup }}>
            <label style={labelStyle}>Tipo</label>
            <select style={inputStyle} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="restaurante">Restaurante</option>
              <option value="cafeteria">Cafetería</option>
              <option value="bar">Bar</option>
              <option value="food truck">Food Truck</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          <div style={{ flex: 1, ...inputGroup }}>
            <label style={labelStyle}>Precio</label>
            <select style={inputStyle} value={form.priceRange} onChange={e => setForm({...form, priceRange: e.target.value})}>
              <option value="economico">Económico (💰)</option>
              <option value="medio">Medio (💰💰)</option>
              <option value="alto">Alto (💰💰💰)</option> 
            </select>
          </div>
        </div>

        {/* PUNTUACIÓN Y HORARIO */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1, ...inputGroup }}>
            <label style={labelStyle}>Puntuación (1-5)</label>
            <select style={inputStyle} value={form.rating} onChange={e => setForm({...form, rating: e.target.value})}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>⭐ {n}</option>)}
            </select>
          </div>

          <div style={{ flex: 1, ...inputGroup }}>
            <label style={labelStyle}>Horario</label>
            <input 
              placeholder="Ej: 09:00 - 21:00" style={inputStyle} 
              value={form.hours} onChange={e => setForm({...form, hours: e.target.value})} 
            />
          </div>
        </div>

        {/* ZONA Y DIRECCIÓN */}
        <div style={inputGroup}>
          <label style={labelStyle}>Barrio / Zona / Ciudad</label>
          <input 
            placeholder="Ej: Centro, Montevideo" required style={inputStyle} 
            value={form.zone} onChange={e => setForm({...form, zone: e.target.value})} 
          />
        </div>
        
        <div style={inputGroup}>
          <label style={labelStyle}>Dirección Exacta</label>
          <input 
            placeholder="Ej: Av. 18 de Julio 1234" required style={inputStyle} 
            value={form.address} onChange={e => setForm({...form, address: e.target.value})} 
          />
        </div>

        {/* IMAGEN */}
        <div style={inputGroup}>
          <label style={labelStyle}>URL de Imagen (Opcional)</label>
          <input 
            placeholder="http://imagen.com/foto.jpg" style={inputStyle} 
            value={form.photos} onChange={e => setForm({...form, photos: e.target.value})} 
          />
        </div>

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Publicando..." : "Publicar Local"}
        </button>
      </form>
    </div>
  );
}

// --- ESTILOS (Mantenemos tu diseño) ---
const containerStyle = { maxWidth: '550px', margin: '40px auto', padding: '40px', background: 'white', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', textAlign: 'center' };
const iconContainer = { fontSize: '45px', marginBottom: '10px' };
const titleStyle = { color: '#2c3e50', fontSize: '26px', fontWeight: '800', margin: '0 0 8px 0' };
const subtitleStyle = { color: '#95a5a6', fontSize: '14px', marginBottom: '30px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '18px' };
const inputGroup = { textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { fontSize: '12px', fontWeight: '700', color: '#e67e22', textTransform: 'uppercase' };
const inputStyle = { padding: '12px 15px', borderRadius: '10px', border: '2px solid #f1f2f6', width: '100%', fontSize: '14px', outline: 'none', backgroundColor: '#f9f9f9' };
const buttonStyle = { padding: '15px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px', fontSize: '16px' };