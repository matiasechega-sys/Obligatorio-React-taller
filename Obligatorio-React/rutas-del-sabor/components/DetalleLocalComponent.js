"use client";

export default function DetalleLocalComponent({ local, platos, onVolver }) {
  if (!local) return null;

  // --- LÓGICA DE IMAGEN DINÁMICA INTELIGENTE ---
  const getDynamicImage = (nombre, categoria) => {
    const name = nombre?.toLowerCase() || "";
    const cat = categoria?.toLowerCase() || "";

    // 1. Detección específica para McDonald's / Fast Food / Hamburguesas
    if (name.includes("mcdonald") || name.includes("burger") || cat.includes("hamburguesa") || cat.includes("fast")) {
      return "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop";
    }
    
    // 2. Café y meriendas
    if (cat.includes("cafe") || cat.includes("merienda") || name.includes("starbucks") || name.includes("cafe")) {
      return "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000&auto=format&fit=crop";
    }

    // 3. Pizza e Italiana
    if (cat.includes("pizza") || cat.includes("italiana") || name.includes("pizz")) {
      return "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop";
    }

    // 4. Parrilla y Carnes
    if (cat.includes("parrilla") || cat.includes("carne") || cat.includes("asado")) {
      return "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop";
    }

    // 5. Sushi y Asiática
    if (cat.includes("sushi") || cat.includes("asiatica") || name.includes("sushi")) {
      return "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop";
    }

    // Imagen por defecto (Restaurante elegante)
    return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop";
  };

  // Asignamos la foto: 1ro la del local, 2do la dinámica por nombre/categoría
  const fotoUrl = (local.photos && local.photos.length > 0) 
    ? local.photos[0] 
    : getDynamicImage(local.name, local.category || local.type);

  return (
    <div style={containerStyle}>
      {/* Botón Volver */}
      <button onClick={onVolver} style={backBtn}>
        <span style={{ fontSize: '1.2rem' }}>←</span> Volver al listado
      </button>

      {/* HERO SECTION: Imagen y Título superpuesto */}
      <div style={heroCard}>
        <div style={{...heroImage, backgroundImage: `url(${fotoUrl})`}}>
          <div style={heroOverlay}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <span style={categoryBadge}>
                {/* Emoji dinámico según el nombre o categoría */}
                {local.name?.toLowerCase().includes("mcdonald") ? "🍟 " : 
                 local.category?.toLowerCase().includes("parrilla") ? "🔥 " : 
                 local.category?.toLowerCase().includes("cafe") ? "☕ " : "🍽️ "}
                {local.category || local.type || "Gastronomía"}
              </span>
              <span style={cityBadge}>📍 {local.city || "Montevideo"}</span>
            </div>
            <h1 style={titleStyle}>{local.name}</h1>
            <p style={subTitle}>{local.address || "Dirección pendiente de confirmación"}</p>
          </div>
        </div>
      </div>

      <div style={detailsGrid}>
        {/* COLUMNA IZQUIERDA: Información técnica */}
        <div style={infoBox}>
          <div style={sectionHeader}>
            <span style={iconCircle}>📝</span>
            <h3 style={sectionTitle}>Sobre nosotros</h3>
          </div>
          <p style={textStyle}>
            {local.description || 
            `Disfruta de la mejor experiencia en ${local.name}. Un lugar referente en ${local.city} que se destaca por su calidad y excelente atención.`}
          </p>
          
          <div style={{...sectionHeader, marginTop: '30px'}}>
            <span style={iconCircle}>⏰</span>
            <h3 style={sectionTitle}>Horarios de Atención</h3>
          </div>
          <div style={timeTable}>
            <div style={timeRow}><span>Lunes a Viernes</span> <strong>12:00 - 23:30</strong></div>
            <div style={timeRow}><span>Sábados y Domingos</span> <strong>11:00 - 01:00</strong></div>
          </div>

          {/* Mapa Visual Simulado */}
          <div style={mapPlaceholder}>
             <span style={{fontSize: '24px'}}>📍</span>
             <p style={{margin: 0, fontSize: '12px', fontWeight: 'bold'}}>Mapa de Ubicación</p>
             <p style={{margin: 0, fontSize: '11px', opacity: 0.7}}>{local.address}, {local.city}</p>
          </div>
        </div>

        {/* COLUMNA DERECHA: Menú de Platos */}
        <div style={menuBox}>
          <div style={sectionHeader}>
            <span style={iconCircle}>🍲</span>
            <h3 style={sectionTitle}>Carta Recomendada</h3>
          </div>
          
          {platos.length === 0 ? (
            <div style={emptyState}>
              <p>Estamos actualizando nuestro menú digital.</p>
              <small>Consulta los platos del día en el local.</small>
            </div>
          ) : (
            <div style={platosContainer}>
              {platos.map((plato, i) => (
                <div key={i} style={platoCard}>
                  <div style={platoInfo}>
                    <span style={platoName}>{plato.name}</span>
                    <span style={platoCat}>{plato.category || "Especialidad"}</span>
                  </div>
                  <div style={platoPrice}>${plato.price}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- ESTILOS ---
const containerStyle = { 
  maxWidth: '1100px', 
  margin: '0 auto', 
  padding: '40px 20px',
  fontFamily: "'Inter', system-ui, sans-serif",
  color: '#1e293b',
  backgroundColor: '#f8fafc'
};

const backBtn = { 
  background: '#fff', 
  border: '1px solid #e2e8f0', 
  color: '#64748b', 
  padding: '12px 20px', 
  borderRadius: '16px',
  fontWeight: '600', 
  cursor: 'pointer', 
  marginBottom: '25px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
  transition: 'all 0.2s'
};

const heroCard = { 
  borderRadius: '32px', 
  overflow: 'hidden', 
  marginBottom: '35px',
  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)',
  border: '4px solid white'
};

const heroImage = {
  height: '450px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  display: 'flex',
  alignItems: 'flex-end'
};

const heroOverlay = {
  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 10%, rgba(0,0,0,0.2) 60%, transparent 100%)',
  width: '100%',
  padding: '50px',
  color: 'white'
};

const titleStyle = { fontSize: '52px', margin: '5px 0', fontWeight: '900', letterSpacing: '-1.5px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' };
const subTitle = { fontSize: '22px', opacity: 0.9, fontWeight: '400' };

const categoryBadge = { 
  background: '#e67e22', 
  color: 'white', 
  padding: '8px 20px', 
  borderRadius: '100px', 
  fontSize: '14px', 
  fontWeight: '800', 
  textTransform: 'uppercase'
};

const cityBadge = {
  background: 'rgba(255,255,255,0.2)',
  backdropFilter: 'blur(10px)',
  color: 'white',
  padding: '8px 20px',
  borderRadius: '100px',
  fontSize: '14px',
  fontWeight: '600',
  border: '1px solid rgba(255,255,255,0.3)'
};

const detailsGrid = { 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
  gap: '30px' 
};

const infoBox = { 
  background: 'white', 
  padding: '40px', 
  borderRadius: '28px', 
  border: '1px solid #f1f5f9',
  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
};

const menuBox = { ...infoBox, background: '#f1f5f9', border: 'none' };

const sectionHeader = { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '22px' };
const iconCircle = { 
  background: '#f8fafc', 
  width: '50px', 
  height: '50px', 
  borderRadius: '16px', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center',
  fontSize: '24px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
};

const sectionTitle = { fontSize: '26px', fontWeight: '800', margin: 0, color: '#0f172a' };
const textStyle = { lineHeight: '1.8', color: '#475569', fontSize: '17px' };

const timeTable = { display: 'flex', flexDirection: 'column', gap: '12px' };
const timeRow = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  padding: '18px', 
  background: 'white', 
  borderRadius: '16px',
  fontSize: '16px',
  border: '1px solid #e2e8f0'
};

const mapPlaceholder = {
  marginTop: '30px',
  height: '110px',
  background: '#f8fafc',
  borderRadius: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  border: '2px dashed #cbd5e1',
  color: '#94a3b8'
};

const platosContainer = { display: 'flex', flexDirection: 'column', gap: '15px' };
const platoCard = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  padding: '20px', 
  background: 'white', 
  borderRadius: '20px', 
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
  border: '1px solid #eee'
};

const platoInfo = { display: 'flex', flexDirection: 'column' };
const platoName = { fontWeight: '800', color: '#1e293b', fontSize: '18px' };
const platoCat = { fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', marginTop: '5px' };
const platoPrice = { fontWeight: '900', color: '#10b981', fontSize: '22px', background: '#f0fdf4', padding: '10px 18px', borderRadius: '14px' };
const emptyState = { textAlign: 'center', padding: '60px', color: '#64748b' };