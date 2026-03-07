"use client";
import { useState } from 'react';

export default function RestauranteRatingComponent({ onSubmit, tipo = "este local" }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState("");

  const handleSubmit = () => {
    if (rating === 0) return;
    
    // Aquí pasamos los datos al componente padre
    onSubmit({
      puntuacion: rating,
      comentario,
      fecha: new Date().toISOString()
    });

    // Resetear formulario tras enviar
    setRating(0);
    setComentario("");
  };

  return (
    <div style={reviewCard}>
      <div style={sectionHeader}>
        <span style={iconCircle}>⭐</span>
        <h3 style={sectionTitle}>¿Qué te pareció {tipo}?</h3>
      </div>

      <p style={labelStyle}>Puntuación (obligatorio):</p>
      
      {/* Contenedor de Estrellas */}
      <div style={starsContainer}>
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          const isActive = ratingValue <= (hover || rating);
          
          return (
            <button
              type="button"
              key={index}
              style={starBtn}
              onClick={() => setRating(ratingValue)}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            >
              <span style={{ 
                fontSize: '35px', 
                color: isActive ? "#ffc107" : "#e2e8f0",
                transition: 'color 0.2s ease-in-out'
              }}>
                ★
              </span>
            </button>
          );
        })}
      </div>

      <p style={labelStyle}>Comentario (opcional):</p>
      <textarea
        placeholder="Comparte tu experiencia..."
        style={textareaStyle}
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
      />

      <button 
        disabled={rating === 0}
        style={{
          ...submitBtn,
          background: rating === 0 ? '#cbd5e1' : '#1e293b',
          cursor: rating === 0 ? 'not-allowed' : 'pointer'
        }}
        onClick={handleSubmit}
      >
        Publicar reseña
      </button>
    </div>
  );
}

// --- ESTILOS ---
const reviewCard = {
  background: 'white',
  padding: '35px',
  borderRadius: '28px',
  border: '1px solid #f1f5f9',
  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
  marginTop: '30px'
};

const sectionHeader = { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' };
const iconCircle = { background: '#f8fafc', width: '45px', height: '45px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' };
const sectionTitle = { fontSize: '22px', fontWeight: '800', margin: 0, color: '#0f172a' };

const labelStyle = { fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' };

const starsContainer = { display: 'flex', gap: '8px', marginBottom: '25px' };
const starBtn = { background: 'none', border: 'none', cursor: 'pointer', padding: 0, outline: 'none' };

const textareaStyle = {
  width: '100%',
  minHeight: '120px',
  padding: '15px',
  borderRadius: '16px',
  border: '2px solid #f1f5f9',
  fontFamily: "'Inter', sans-serif",
  fontSize: '15px',
  marginBottom: '20px',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
  ':focus': { borderColor: '#e2e8f0' }
};

const submitBtn = {
  width: '100%',
  color: 'white',
  padding: '15px',
  borderRadius: '14px',
  border: 'none',
  fontWeight: '700',
  fontSize: '16px',
  transition: 'all 0.3s'
};