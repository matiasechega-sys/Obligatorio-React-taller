"use client";

const ListadoRating = ({ reviews }) => {
  // Función interna para renderizar estrellas estáticas (solo lectura)
  const renderStars = (rating) => {
    return (
      <div style={starsWrapper}>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            style={{
              fontSize: '20px',
              color: index < rating ? "#ffc107" : "#e2e8f0",
              marginRight: '2px'
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div style={containerSection}>
      <div style={contentGrid}>
        
        {/* COLUMNA IZQUIERDA: Encabezado */}
        <div style={headerText}>
          <h2 style={titleStyle}>Reseñas</h2>
          <p style={descStyle}>
            Lo que otros usuarios opinan sobre esta experiencia.
          </p>
          <div style={divider}></div>
        </div>

        {/* COLUMNA DERECHA: Lista de tarjetas */}
        <div style={listContainer}>
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} style={reviewCard}>
                <div style={flexLayout}>
                  <img
                    alt="Avatar"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFv_rUJ2Ru3GR0Jxy2YTNH_jrVzX3_HY-THQ&s"
                    style={avatarStyle}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={topRow}>
                      <span style={userName}>Usuario Gourmet</span>
                      {/* Estrellas nativas sin librerías */}
                      {renderStars(review.rating || review.puntuacion)}
                    </div>
                    <p style={commentText}>
                      "{review.comment || review.comentario || "Sin comentario."}"
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={emptyState}>
              <p>Aún no hay reseñas. ¡Sé el primero en compartir!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- ESTILOS EN JS PURO ---
const containerSection = {
  width: '100%',
  padding: '60px 0',
  backgroundColor: '#f8fafc',
  marginTop: '40px',
  borderTop: '1px solid #e2e8f0'
};

const contentGrid = {
  maxWidth: '1100px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '40px',
  padding: '0 20px'
};

const headerText = {
  position: 'sticky',
  top: '20px',
  height: 'fit-content'
};

const titleStyle = {
  fontSize: '36px',
  fontWeight: '900',
  color: '#0f172a',
  margin: '0 0 10px 0',
  letterSpacing: '-1px'
};

const descStyle = {
  fontSize: '18px',
  color: '#64748b',
  lineHeight: '1.6',
  margin: 0
};

const divider = {
  width: '60px',
  height: '4px',
  backgroundColor: '#e67e22',
  marginTop: '20px',
  borderRadius: '2px'
};

const listContainer = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const reviewCard = {
  backgroundColor: 'white',
  padding: '25px',
  borderRadius: '24px',
  border: '1px solid #f1f5f9',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
  transition: 'transform 0.2s ease'
};

const flexLayout = {
  display: 'flex',
  gap: '20px',
  alignItems: 'flex-start'
};

const avatarStyle = {
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '3px solid #f8fafc'
};

const topRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px',
  flexWrap: 'wrap',
  gap: '10px'
};

const starsWrapper = {
  display: 'flex',
  alignItems: 'center'
};

const userName = {
  fontWeight: '800',
  color: '#1e293b',
  fontSize: '16px'
};

const commentText = {
  fontSize: '15px',
  color: '#475569',
  lineHeight: '1.6',
  fontStyle: 'italic',
  margin: 0
};

const emptyState = {
  padding: '40px',
  textAlign: 'center',
  backgroundColor: '#f1f5f9',
  borderRadius: '20px',
  color: '#94a3b8',
  border: '2px dashed #cbd5e1'
};

export default ListadoRating;