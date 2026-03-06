"use client";
import { useState } from 'react';

export default function ListadoPlatos({ platos }) {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");

  // --- LÓGICA DE FILTRADO ---
  const platosFiltrados = platos.filter(p => {
    const term = busqueda.toLowerCase();
    const matchesText = 
      p.name?.toLowerCase().includes(term) || 
      p.city?.toLowerCase().includes(term) || 
      p.description?.toLowerCase().includes(term);
    
    const matchesCategory = categoria === "" || p.category === categoria;
    
    return matchesText && matchesCategory;
  });

  return (
    <div style={{ marginTop: '30px' }}>
      <div style={filterBar}>
        <input 
          placeholder="Buscar plato, ciudad o local..." 
          style={inputStyle} 
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select style={selectStyle} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Todas las categorías</option>
          <option value="entrada">Entrada</option>
          <option value="principal">Principal</option>
          <option value="postre">Postre</option>
          <option value="bebida">Bebida</option>
          <option value="otros">Otros</option>
        </select>
      </div>

      <div style={gridStyle}>
        {platosFiltrados.map((plato, index) => (
          <div key={index} style={plateCard}>
            <div style={priceTag}>${plato.price}</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{plato.name}</h3>
            <p style={descStyle}>{plato.description}</p>
            <div style={infoRow}>
              <span>📍 {plato.city}</span>
              <span style={badgeStyle}>{plato.category}</span>
            </div>
          </div>
        ))}
      </div>
      {platosFiltrados.length === 0 && <p style={{textAlign:'center', color:'#95a5a6'}}>No se encontraron platos.</p>}
    </div>
  );
}

// --- ESTILOS ---
const filterBar = { display: 'flex', gap: '10px', marginBottom: '20px' };
const inputStyle = { flex: 2, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' };
const selectStyle = { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' };
const plateCard = { padding: '20px', background: 'white', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', position: 'relative' };
const priceTag = { position: 'absolute', top: '15px', right: '15px', background: '#27ae60', color: 'white', padding: '5px 10px', borderRadius: '8px', fontWeight: 'bold' };
const descStyle = { fontSize: '14px', color: '#7f8c8d', marginBottom: '15px' };
const infoRow = { display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold' };
const badgeStyle = { background: '#f1f2f6', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' };