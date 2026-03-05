"use client"; // Siempre arriba si usas useState o useEffect
import { useState, useEffect } from 'react';

// EL ERROR SE VA SI PONES "export default function..."
export default function HomePage() { 
  const [locales, setLocales] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetch('/api/locals')
      .then(res => res.json())
      .then(data => setLocales(data));
  }, []);

  const filtrados = locales.filter(l => 
    l.name.toLowerCase().includes(filtro.toLowerCase()) || 
    l.type.toLowerCase().includes(filtro.toLowerCase()) ||
    l.zone.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <div style={{textAlign: 'center', marginBottom: '40px'}}>
        <h1 style={{color: '#2c3e50', fontSize: '36px'}}>📍 Rutas del Sabor</h1>
        <p style={{color: '#7f8c8d'}}>Busca y descubre los mejores lugares</p>
        <input 
          placeholder="Buscar restaurante, zona, o tipo..." 
          style={searchStyle}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      <div style={gridStyle}>
        {filtrados.map(local => (
          <div key={local.id} style={cardStyle}>
            <span style={{fontSize: '50px'}}>{local.photos?.[0] || "🍴"}</span>
            <h3 style={{color: '#e67e22', margin: '15px 0'}}>{local.name}</h3>
            <div style={{fontSize: '13px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase'}}>
              {local.type}
            </div>
            <p style={{fontSize: '15px', margin: '10px 0'}}><strong>{local.zone}</strong></p>
            <p style={{color: '#94a3b8', fontSize: '14px'}}>💰 {local.priceRange}</p>
            <p style={{marginTop: '10px'}}>⭐ {local.rating}.0</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Estilos rápidos para que no se rompa nada
const searchStyle = { width: '100%', maxWidth: '500px', padding: '16px', borderRadius: '50px', border: '2px solid #e67e22', outline: 'none', marginTop: '20px', boxShadow: '0 4px 12px rgba(230, 126, 34, 0.1)' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' };
const cardStyle = { background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center', transition: 'transform 0.2s' };