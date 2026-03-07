"use client";
import { useState } from 'react';
import RestauranteRatingComponent from "./RestauranteRatingComponent";
import ListadoRating from "./ListadoRating";
// Importamos la función centralizada de tu archivo de servicios
import { postReviewPlato } from '@/services/api'; 

export default function DetallePlatoComponent({ plato, onVolver }) {
  const [reviews, setReviews] = useState(plato?.reviews || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!plato) return null;

  // --- MANEJADOR DE RESEÑA ADAPTADO ---
  const handleNewReview = async (data) => {
    setIsSubmitting(true);
    
    // PRIORIDAD: Capturar el ID real de la base de datos (MongoDB usa _id)
    const platoId = plato._id || plato.id;

    console.log("Intentando reseña para el plato ID:", platoId);

    try {
      // El servicio api.js validará si es un ID temporal o inválido
      const result = await postReviewPlato(platoId, data.puntuacion, data.comentario);

      if (result.success) {
        // Estructura de la reseña para actualizar la UI inmediatamente
        const reviewCreada = result.data || {
          rating: data.puntuacion,
          comment: data.comentario,
          user: JSON.parse(localStorage.getItem('user'))?.username || "Usuario",
          createdAt: new Date().toISOString()
        };
        
        setReviews([reviewCreada, ...reviews]);
        alert("¡Calificación enviada con éxito!");
      } else {
        // Aquí atrapamos el error de "ID no válido" o errores del servidor
        alert(`Atención: ${result.error}`);
      }
    } catch (error) {
      console.error("Error en componente platos:", error);
      alert("No se pudo conectar con el servidor de reseñas.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- LÓGICA DE IMAGEN DINÁMICA ---
  const getDynamicPlatoImage = (nombre, categoria) => {
    const name = nombre?.toLowerCase() || "";
    const cat = categoria?.toLowerCase() || "";
    if (cat.includes("pasta") || name.includes("fideo") || name.includes("pasta")) {
      return "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=1000&auto=format&fit=crop";
    }
    if (cat.includes("postre") || name.includes("torta") || name.includes("dulce")) {
      return "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000&auto=format&fit=crop";
    }
    if (cat.includes("hamburguesa") || name.includes("burger")) {
      return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop";
    }
    if (cat.includes("bebida") || cat.includes("trago")) {
      return "https://images.unsplash.com/photo-1544145945-f904253d0c7b?q=80&w=1000&auto=format&fit=crop";
    }
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop";
  };

  const fotoUrl = (plato.photos && plato.photos.length > 0) 
    ? plato.photos[0] 
    : getDynamicPlatoImage(plato.name || plato.nombre, plato.category);

  return (
    <div style={containerStyle}>
      <button onClick={onVolver} style={backBtn}>
        <span>←</span> Volver a la ruta
      </button>

      {/* HERO SECTION */}
      <div style={heroCard}>
        <div style={{...heroImage, backgroundImage: `url(${fotoUrl})`}}>
          <div style={heroOverlay}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <span style={categoryBadge}>
                {plato.category?.toLowerCase().includes("postre") ? "🍰 " : 
                 plato.category?.toLowerCase().includes("bebida") ? "🥤 " : "🍲 "}
                {plato.category || "Principal"}
              </span>
              <span style={cityBadge}>📍 {plato.city || "Uruguay"}</span>
            </div>
            <h1 style={titleStyle}>{plato.name || plato.nombre}</h1>
            <p style={subTitle}>Servido en: <strong>{plato.localName || "Local asociado"}</strong></p>
          </div>
        </div>
      </div>

      <div style={detailsGrid}>
        {/* COLUMNA IZQUIERDA: Reseña y Autor */}
        <div style={infoBox}>
          <div style={sectionHeader}>
            <span style={iconCircle}>⭐</span>
            <h3 style={sectionTitle}>Reseña del Plato</h3>
          </div>
          <p style={textStyle}>
            {plato.description || 
            `Este delicioso plato de ${plato.name} es una de las especialidades recomendadas de la zona.`}
          </p>
          
          <div style={{...sectionHeader, marginTop: '30px'}}>
            <span style={iconCircle}>👨‍💻</span>
            <h3 style={sectionTitle}>Autor</h3>
          </div>
          <div style={authorCard}>
            <div style={avatar}>{ (plato.autorPlato || plato.creadoPor || "U").charAt(0).toUpperCase() }</div>
            <div>
              <p style={{margin: 0, fontWeight: 'bold', color: '#1e293b'}}>Subido por:</p>
              <p style={{margin: 0, color: '#e67e22', fontWeight: '800'}}>{(plato.autorPlato || plato.creadoPor || "Usuario Anónimo").toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Ficha Técnica */}
        <div style={menuBox}>
          <div style={sectionHeader}>
            <span style={iconCircle}>📊</span>
            <h3 style={sectionTitle}>Ficha Técnica</h3>
          </div>
          <div style={timeTable}>
            <div style={timeRow}><span>Precio</span> <strong style={{color: '#10b981', fontSize: '20px'}}>${plato.price}</strong></div>
            <div style={timeRow}><span>Categoría</span> <strong>{plato.category || "General"}</strong></div>
            <div style={timeRow}><span>Ubicación</span> <strong>{plato.city || "Uruguay"}</strong></div>
          </div>
        </div>
      </div>

      {/* --- SECCIÓN DE RESEÑAS --- */}
      <div style={{ ...reviewsSection, opacity: isSubmitting ? 0.6 : 1, pointerEvents: isSubmitting ? 'none' : 'auto' }}>
        <RestauranteRatingComponent 
          tipo="este plato" 
          onSubmit={handleNewReview} 
        />
        {isSubmitting && (
          <p style={{textAlign: 'center', color: '#e67e22', fontWeight: 'bold', marginTop: '10px'}}>
            Publicando calificación...
          </p>
        )}
        <ListadoRating reviews={reviews} />
      </div>
    </div>
  );
}

// --- ESTILOS ---
const containerStyle = { maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', fontFamily: "'Inter', sans-serif", color: '#1e293b', backgroundColor: '#f8fafc' };
const backBtn = { background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', padding: '12px 20px', borderRadius: '16px', fontWeight: '600', cursor: 'pointer', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' };
const heroCard = { borderRadius: '32px', overflow: 'hidden', marginBottom: '35px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)', border: '4px solid white' };
const heroImage = { height: '450px', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', display: 'flex', alignItems: 'flex-end' };
const heroOverlay = { background: 'linear-gradient(to top, rgba(0,0,0,0.9) 10%, rgba(0,0,0,0.2) 60%, transparent 100%)', width: '100%', padding: '50px', color: 'white' };
const titleStyle = { fontSize: '52px', margin: '5px 0', fontWeight: '900', letterSpacing: '-1.5px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' };
const subTitle = { fontSize: '22px', opacity: 0.9, fontWeight: '400' };
const categoryBadge = { background: '#e67e22', color: 'white', padding: '8px 20px', borderRadius: '100px', fontSize: '14px', fontWeight: '800', textTransform: 'uppercase' };
const cityBadge = { background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: 'white', padding: '8px 20px', borderRadius: '100px', fontSize: '14px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.3)' };
const detailsGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' };
const infoBox = { background: 'white', padding: '40px', borderRadius: '28px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' };
const menuBox = { ...infoBox, background: '#f1f5f9', border: 'none' };
const sectionHeader = { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '22px' };
const iconCircle = { background: '#f8fafc', width: '50px', height: '50px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' };
const sectionTitle = { fontSize: '26px', fontWeight: '800', margin: 0, color: '#0f172a' };
const textStyle = { lineHeight: '1.8', color: '#475569', fontSize: '17px', fontStyle: 'italic' };
const authorCard = { display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', background: '#fff7ed', borderRadius: '20px', border: '1px solid #ffedd5' };
const avatar = { width: '45px', height: '45px', background: '#e67e22', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' };
const timeTable = { display: 'flex', flexDirection: 'column', gap: '12px' };
const timeRow = { display: 'flex', justifyContent: 'space-between', padding: '18px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '16px' };
const reviewsSection = { marginTop: '40px' };