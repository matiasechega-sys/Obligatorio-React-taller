"use client";
import { useState } from 'react';

export default function AltaLocalesComponent() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: 'restaurante',
    priceRange: 'medio',
    city: 'Montevideo',
    zone: '',
    address: '',
    hours: '09:00 - 23:00',
    photos: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Obtenemos el token del almacenamiento local
    const token = localStorage.getItem('token');
    
    try {
      // CAMBIO CLAVE: Ahora llamamos a nuestra propia API Route (/api/locals)
      const response = await fetch("/api/locals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          // Aseguramos que photos sea un array como pide la API
          photos: [form.photos || "https://via.placeholder.com/300"]
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ ¡Local creado con éxito!");
        // Redirección limpia al inicio
        window.location.href = "/";
      } else {
        // Mostramos el error específico que devuelve el Proxy
        alert(`❌ Error: ${data.error || "No se pudo crear el local"}`);
      }
    } catch (err) {
      console.error("Error en la petición:", err);
      alert("🚨 Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#e67e22', textAlign: 'center', marginBottom: '20px' }}>Registrar Nuevo Local</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input 
          placeholder="Nombre del local" 
          required 
          style={inputStyle} 
          onChange={e => setForm({...form, name: e.target.value})} 
        />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <select 
            style={inputStyle} 
            value={form.type}
            onChange={e => setForm({...form, type: e.target.value})}
          >
            <option value="restaurante">Restaurante</option>
            <option value="cafeteria">Cafetería</option>
            <option value="bar">Bar</option>
          </select>

          <select 
            style={inputStyle} 
            value={form.priceRange}
            onChange={e => setForm({...form, priceRange: e.target.value})}
          >
            <option value="economico">Económico</option>
            <option value="medio">Medio</option>
            <option value="caro">Caro</option>
          </select>
        </div>

        <input 
          placeholder="Barrio / Zona (ej: Pocitos)" 
          required 
          style={inputStyle} 
          onChange={e => setForm({...form, zone: e.target.value})} 
        />
        
        <input 
          placeholder="Dirección exacta" 
          required 
          style={inputStyle} 
          onChange={e => setForm({...form, address: e.target.value})} 
        />

        <input 
          placeholder="URL de la Foto (opcional)" 
          style={inputStyle} 
          onChange={e => setForm({...form, photos: e.target.value})} 
        />

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Enviando datos..." : "Publicar Local"}
        </button>
      </form>
    </div>
  );
}

// Estilos consistentes
const containerStyle = { 
  maxWidth: '500px', 
  margin: '20px auto', 
  padding: '30px', 
  background: 'white', 
  borderRadius: '20px', 
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)' 
};

const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };

const inputStyle = { 
  padding: '12px 15px', 
  borderRadius: '10px', 
  border: '1px solid #e2e8f0', 
  width: '100%',
  fontSize: '14px',
  outline: 'none'
};

const buttonStyle = { 
  padding: '15px', 
  background: '#e67e22', 
  color: 'white', 
  border: 'none', 
  borderRadius: '10px', 
  cursor: 'pointer', 
  fontWeight: 'bold',
  marginTop: '10px',
  transition: 'background 0.3s'
};