"use client";

export default function ListadoPrincipal({ locales }) {
  const listaSegura = Array.isArray(locales) ? locales : [];

  if (listaSegura.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#94a3b8', fontSize: '18px' }}>
          No se encontraron locales. <br />
          <small>Prueba creando uno nuevo o quitando los filtros.</small>
        </p>
      </div>
    );
  }

  return (
    <div style={gridStyle}>
      {listaSegura.map((local, index) => {
        // --- NORMALIZACIÓN ---
        const nombre = local.name || local.nombre || "Sin nombre";
        const tipo = String(local.type || local.tipo || "restaurante").toLowerCase();
        const zona = local.zone || local.barrio || "Montevideo";
        const precioRaw = String(local.priceRange || local.precio || "medio").toLowerCase().trim();
        
        // PUNTUACIÓN Y HORA (Nuevos campos)
        const puntuacion = Number(local.rating || 5);
        const horario = local.hours || "Consultar horario";

        const foto = (local.photos && local.photos.length > 0) 
          ? local.photos[0] 
          : "https://via.placeholder.com/300";

        return (
          <div key={local.id || local._id || index} style={cardStyle}>
            <div style={{ marginBottom: '15px' }}>
                <img 
                    src={foto} 
                    alt={nombre} 
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '15px' }} 
                />
            </div>

            <div style={tagStyle}>{tipo}</div>

            <h3 style={{ color: '#2c3e50', margin: '10px 0', fontSize: '18px', fontWeight: '800' }}>
              {nombre}
            </h3>

            <p style={{ fontSize: '13px', color: '#64748b', margin: '5px 0' }}>
              📍 <strong>{zona}</strong>
            </p>

            {/* Visualización del Horario */}
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>
              🕒 {horario}
            </p>

            {/* Visualización de Estrellas Dinámicas */}
            <div style={{ marginBottom: '12px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < puntuacion ? '#f1c40f' : '#e2e8f0', fontSize: '16px' }}>
                  ★
                </span>
              ))}
              <span style={{ marginLeft: '5px', fontSize: '14px', fontWeight: 'bold', color: '#f1c40f' }}>
                {puntuacion}.0
              </span>
            </div>

            <div style={priceBadgeStyle(precioRaw)}>
               {precioRaw.includes('alto') ? '💰💰💰 ALTO' : 
                precioRaw.includes('medio') ? '💰💰 MEDIO' : '💰 ECONÓMICO'}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- ESTILOS ---
const gridStyle = { 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
  gap: '20px',
  padding: '10px'
};

const cardStyle = { 
  background: 'white', 
  padding: '20px', 
  borderRadius: '24px', 
  boxShadow: '0 4px 20px rgba(0,0,0,0.04)', 
  textAlign: 'center',
  border: '1px solid #f1f5f9',
  position: 'relative'
};

const priceBadgeStyle = (p) => ({
  fontSize: '10px',
  padding: '5px 12px',
  borderRadius: '12px',
  display: 'inline-block',
  fontWeight: '800',
  backgroundColor: p.includes('alto') ? '#fff1f2' : p.includes('medio') ? '#fff7ed' : '#f0fdf4',
  color: p.includes('alto') ? '#e11d48' : p.includes('medio') ? '#ea580c' : '#16a34a',
  border: '1px solid currentColor'
});

const tagStyle = {
  fontSize: '9px',
  color: '#64748b',
  fontWeight: '900',
  textTransform: 'uppercase',
  backgroundColor: '#f8fafc',
  padding: '4px 10px',
  borderRadius: '6px',
  letterSpacing: '0.5px'
};