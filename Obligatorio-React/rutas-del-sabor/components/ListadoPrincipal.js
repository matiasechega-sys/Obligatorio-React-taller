"use client";

export default function ListadoPrincipal({ datos, tipo, onSeleccionarLocal, onSeleccionarPlato }) {
  const lista = Array.isArray(datos) ? datos : [];

  if (lista.length === 0) return <p style={{textAlign:'center', color: '#94a3b8', padding: '20px'}}>No hay resultados para mostrar.</p>;

  return (
    <div style={gridStyle}>
      {lista.map((item, index) => {
        if (!item) return null;
        const nombreDisplay = item.name || item.nombre || "Sin nombre";
        
        // Manejo de autor dinámico según el tipo
        const autorRaw = tipo === 'locales' 
          ? (item.creadoPor || item.autorLocal || item.autor) 
          : (item.autorPlato || item.creadoPor || item.autor);
        const autorDisplay = autorRaw ? autorRaw.toUpperCase() : "ANÓNIMO";

        return tipo === 'locales' ? (
          /* TARJETA DE LOCALES */
          <div 
            key={item.id || index} 
            style={platoCardStyle} 
            onClick={() => onSeleccionarLocal?.(item)}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={categoryBadge}>{item.type || item.category || 'Restaurante'}</span>
              <span style={authorTag}>👤 {autorDisplay}</span>
            </div>

            <img 
              src={(item.photos && item.photos.length > 0) ? item.photos[0] : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400"} 
              style={{ ...imgStyle, height: '140px', marginBottom: '15px' }} 
              alt={nombreDisplay}
            />

            <h3 style={titleStylePlato}>{nombreDisplay}</h3>
            <p style={infoStyle}>📍 {item.city || item.zone || "Uruguay"}</p>
            
            <div style={{ ...starsContainer, marginTop: '8px' }}>
               {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < (item.rating || 5) ? '#f1c40f' : '#e2e8f0', fontSize: '18px' }}>★</span>
              ))}
            </div>

            <div style={localRelStyle}>
              <div style={priceBadgeStyle(String(item.priceRange || 'medio').toLowerCase())}>
                 {String(item.priceRange).includes('alto') ? '💰💰💰 ALTO' : '💰💰 MEDIO'}
              </div>
            </div>
          </div>
        ) : (
          /* TARJETA DE PLATOS */
          <div 
            key={item.id || index} 
            style={platoCardStyle} 
            onClick={() => onSeleccionarPlato?.(item)}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={priceTagFloat}>${item.price}</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={categoryBadge}>{item.category || 'General'}</span>
              <span style={authorTag}>👤 {autorDisplay}</span>
            </div>

            <img 
              src={(item.photos && item.photos.length > 0) ? item.photos[0] : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400"} 
              style={{ ...imgStyle, height: '140px', marginBottom: '15px' }} 
              alt={nombreDisplay}
            />

            <h3 style={titleStylePlato}>{nombreDisplay}</h3>
            <p style={infoStyle}>📍 {item.city || "Uruguay"}</p>
            <p style={descStyle}>{item.description || "Sin descripción disponible."}</p>
            
            <div style={localRelStyle}>🏠 {item.localName || "Local asociado"}</div>
          </div>
        );
      })}
    </div>
  );
}

// --- ESTILOS ACTUALIZADOS ---
const gridStyle = { 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
  gap: '25px', 
  marginTop: '20px',
  padding: '10px'
};

const cardStyle = { 
  background: 'white', 
  padding: '20px', 
  borderRadius: '24px', 
  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', 
  position: 'relative', 
  cursor: 'pointer', 
  transition: 'all 0.3s ease',
  border: '1px solid #f1f5f9'
};

const platoCardStyle = { ...cardStyle, textAlign: 'left' };

const imgStyle = { 
  width: '100%', 
  objectFit: 'cover', 
  borderRadius: '16px',
  backgroundColor: '#f1f5f9'
};

const titleStylePlato = { 
  color: '#0f172a', 
  marginTop: '0px', 
  marginBottom: '5px', 
  fontSize: '19px', 
  fontWeight: '800',
  letterSpacing: '-0.5px'
};

const infoStyle = { fontSize: '13px', color: '#64748b', margin: '0', fontWeight: '500' };
const starsContainer = { marginBottom: '5px' };

const authorTag = { 
  fontSize: '10px', 
  color: '#e67e22', 
  fontWeight: '900', 
  textTransform: 'uppercase', 
  background: '#fff7ed', 
  padding: '4px 10px', 
  borderRadius: '100px',
  border: '1px solid #ffedd5'
};

const priceTagFloat = { 
  position: 'absolute', 
  top: '20px', 
  right: '20px', 
  background: 'rgba(16, 185, 129, 0.9)', 
  backdropFilter: 'blur(4px)',
  color: 'white', 
  padding: '6px 14px', 
  borderRadius: '12px', 
  fontWeight: '800',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  zIndex: 1
};

const categoryBadge = { 
  padding: '4px 12px', 
  background: '#f8fafc', 
  borderRadius: '8px', 
  fontSize: '11px', 
  color: '#475569', 
  fontWeight: '700', 
  textTransform: 'uppercase',
  border: '1px solid #e2e8f0'
};

const descStyle = { 
  fontSize: '13px', 
  color: '#64748b', 
  height: '38px', 
  overflow: 'hidden', 
  margin: '12px 0',
  lineHeight: '1.4'
};

const localRelStyle = { 
  marginTop: '12px', 
  paddingTop: '12px', 
  borderTop: '1px solid #f1f5f9', 
  fontSize: '12px', 
  color: '#94a3b8',
  fontWeight: '600'
};

const priceBadgeStyle = (p) => ({ 
  fontSize: '11px', 
  padding: '5px 12px', 
  borderRadius: '100px', 
  display: 'inline-block', 
  fontWeight: '800', 
  backgroundColor: p.includes('alto') ? '#fff1f2' : '#f0fdf4', 
  color: p.includes('alto') ? '#e11d48' : '#16a34a', 
  border: '1px solid currentColor' 
});