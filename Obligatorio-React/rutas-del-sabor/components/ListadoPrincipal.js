"use client";

export default function ListadoPrincipal({ locales }) {
  return (
    <div style={gridStyle}>
      {locales.map(local => (
        <div key={local.id || local._id} style={cardStyle}>
          <div style={{ fontSize: '50px', marginBottom: '10px' }}>
            {local.type?.toLowerCase() === 'cafeteria' ? "☕" : "🍴"}
          </div>

          <h3 style={{ color: '#e67e22', margin: '15px 0' }}>{local.name}</h3>

          <div style={tagStyle}>
            {local.type}
          </div>

          <p style={{ fontSize: '15px', margin: '10px 0' }}>
            <strong>{local.zone}</strong>
          </p>

          <p style={{ color: '#94a3b8', fontSize: '14px' }}>💰 {local.priceRange}</p>

          <p style={{ marginTop: '10px', color: '#f1c40f', fontWeight: 'bold' }}>
            ⭐ {local.rating || 5}.0
          </p>
        </div>
      ))}
    </div>
  );
}

// Estilos movidos al componente para limpiar el page.js
const gridStyle = { 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
  gap: '25px' 
};

const cardStyle = { 
  background: 'white', 
  padding: '30px', 
  borderRadius: '20px', 
  boxShadow: '0 10px 25px rgba(0,0,0,0.05)', 
  textAlign: 'center',
  border: '1px solid #f1f5f9'
};

const tagStyle = {
  fontSize: '11px',
  color: '#64748b',
  fontWeight: '800',
  textTransform: 'uppercase',
  backgroundColor: '#f1f5f9',
  padding: '4px 10px',
  borderRadius: '6px',
  display: 'inline-block'
};