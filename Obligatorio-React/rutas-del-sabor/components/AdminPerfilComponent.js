"use client";
import { useState } from 'react';

export default function AdminPerfilComponent({ alGuardarLocal, alGuardarPlato, localesExistentes }) {
  const [tab, setTab] = useState('local'); 

  const [nuevoLocal, setNuevoLocal] = useState({
    name: '',
    type: 'restaurante',
    priceRange: 'medio', 
    zone: '',
    city: 'Montevideo', 
    address: '',
    photos: '',
    rating: '5',
    hours: '09:00 - 23:00'
  });

  const [nuevoPlato, setNuevoPlato] = useState({
    name: '',
    category: 'principal',
    localId: '',
    city: 'Montevideo',
    price: '',
    description: ''
  });

  const manejarSubmitLocal = (e) => {
    e.preventDefault();
    
    // Solo enviamos los datos del formulario. 
    // El "creadoPor" lo inyecta el padre (PerfilPage) para mayor seguridad.
    const payload = {
      ...nuevoLocal,
      name: nuevoLocal.name.trim(),
      rating: Number(nuevoLocal.rating),
      photos: nuevoLocal.photos.trim() ? [nuevoLocal.photos.trim()] : []
    };

    alGuardarLocal(payload);
    // Limpiamos el formulario
    setNuevoLocal({ ...nuevoLocal, name: '', zone: '', address: '', photos: '' });
  };

  const manejarSubmitPlato = (e) => {
    e.preventDefault();

    const payload = {
      ...nuevoPlato,
      price: Number(nuevoPlato.price)
    };

    alGuardarPlato(payload);
    // Limpiamos el formulario
    setNuevoPlato({ ...nuevoPlato, name: '', price: '', description: '' });
  };

  return (
    <div style={formContainer}>
      <div style={tabBar}>
        <button 
          type="button"
          onClick={() => setTab('local')} 
          style={tab === 'local' ? activeTab : inactiveTab}
        >
          🏢 Registrar Local
        </button>
        <button 
          type="button"
          onClick={() => setTab('plato')} 
          style={tab === 'plato' ? activeTab : inactiveTab}
        >
          🍲 Cargar Plato
        </button>
      </div>

      {tab === 'local' ? (
        <form onSubmit={manejarSubmitLocal} style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>Nombre del Local</label>
            <input required style={inputStyle} value={nuevoLocal.name} onChange={e => setNuevoLocal({...nuevoLocal, name: e.target.value})} placeholder="Ej: La Pasiva" />
          </div>
          
          <div style={row}>
            <div style={inputGroup}>
              <label style={labelStyle}>Tipo</label>
              <select style={inputStyle} value={nuevoLocal.type} onChange={e => setNuevoLocal({...nuevoLocal, type: e.target.value})}>
                <option value="restaurante">Restaurante</option>
                <option value="cafeteria">Cafetería</option>
                <option value="bar">Bar</option>
                <option value="food truck">Food Truck</option>
              </select>
            </div>
            <div style={inputGroup}>
              <label style={labelStyle}>Precio esperado</label>
              <select style={inputStyle} value={nuevoLocal.priceRange} onChange={e => setNuevoLocal({...nuevoLocal, priceRange: e.target.value})}>
                <option value="economico">Económico</option>
                <option value="medio">Medio</option>
                <option value="alto">Alto</option>
              </select>
            </div>
          </div>

          <div style={row}>
            <div style={inputGroup}>
              <label style={labelStyle}>Puntuación</label>
              <select style={inputStyle} value={nuevoLocal.rating} onChange={e => setNuevoLocal({...nuevoLocal, rating: e.target.value})}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>⭐ {n} Estrellas</option>)}
              </select>
            </div>
            <div style={inputGroup}>
              <label style={labelStyle}>Horario</label>
              <input style={inputStyle} required value={nuevoLocal.hours} onChange={e => setNuevoLocal({...nuevoLocal, hours: e.target.value})} />
            </div>
          </div>

          <div style={row}>
            <div style={inputGroup}>
              <label style={labelStyle}>Ciudad</label>
              <input required style={inputStyle} value={nuevoLocal.city} onChange={e => setNuevoLocal({...nuevoLocal, city: e.target.value})} />
            </div>
            <div style={inputGroup}>
              <label style={labelStyle}>Barrio / Zona</label>
              <input required style={inputStyle} value={nuevoLocal.zone} onChange={e => setNuevoLocal({...nuevoLocal, zone: e.target.value})} placeholder="Pocitos" />
            </div>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>URL de Foto (Opcional)</label>
            <input style={inputStyle} value={nuevoLocal.photos} onChange={e => setNuevoLocal({...nuevoLocal, photos: e.target.value})} placeholder="https://..." />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Dirección Exacta</label>
            <input required style={inputStyle} value={nuevoLocal.address} onChange={e => setNuevoLocal({...nuevoLocal, address: e.target.value})} />
          </div>

          <button type="submit" style={submitBtn}>🚀 Publicar Local</button>
        </form>
      ) : (
        <form onSubmit={manejarSubmitPlato} style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>¿En qué local?</label>
            <select required style={inputStyle} value={nuevoPlato.localId} onChange={e => setNuevoPlato({...nuevoPlato, localId: e.target.value})}>
              <option value="" disabled>Seleccionar local...</option>
              {localesExistentes.map((l, i) => (
                <option key={l.id || i} value={l.id || l.name}>{l.name}</option>
              ))}
            </select>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Nombre del Plato</label>
            <input required style={inputStyle} value={nuevoPlato.name} onChange={e => setNuevoPlato({...nuevoPlato, name: e.target.value})} placeholder="Ej: Chivito Completo" />
          </div>

          <div style={row}>
            <div style={inputGroup}>
              <label style={labelStyle}>Categoría</label>
              <select style={inputStyle} value={nuevoPlato.category} onChange={e => setNuevoPlato({...nuevoPlato, category: e.target.value})}>
                <option value="entrada">Entrada</option>
                <option value="principal">Principal</option>
                <option value="postre">Postre</option>
                <option value="bebida">Bebida</option>
              </select>
            </div>
            <div style={inputGroup}>
              <label style={labelStyle}>Precio ($)</label>
              <input required type="number" style={inputStyle} value={nuevoPlato.price} onChange={e => setNuevoPlato({...nuevoPlato, price: e.target.value})} />
            </div>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Descripción / Reseña</label>
            <textarea 
              style={{...inputStyle, height: '70px', resize: 'none'}} 
              value={nuevoPlato.description} 
              onChange={e => setNuevoPlato({...nuevoPlato, description: e.target.value})} 
              placeholder="¿Qué te pareció este plato?"
            />
          </div>

          <button type="submit" style={submitBtnPlato}>✨ Guardar Plato</button>
        </form>
      )}
    </div>
  );
}

// --- ESTILOS ---
const labelStyle = { fontSize: '11px', fontWeight: 'bold', color: '#e67e22', textTransform: 'uppercase', marginBottom: '2px' };
const formContainer = { background: 'white', padding: '30px', borderRadius: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', maxWidth: '550px', margin: '10px auto' };
const tabBar = { display: 'flex', gap: '10px', marginBottom: '25px', background: '#f1f5f9', padding: '5px', borderRadius: '15px' };
const tabBtn = { flex: 1, padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' };
const activeTab = { ...tabBtn, background: 'white', color: '#e67e22', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };
const inactiveTab = { ...tabBtn, background: 'transparent', color: '#64748b' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 };
const inputStyle = { padding: '10px 15px', borderRadius: '10px', border: '2px solid #f1f2f6', fontSize: '14px', outline: 'none', backgroundColor: '#f9f9f9' };
const row = { display: 'flex', gap: '15px' };
const submitBtn = { background: '#e67e22', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' };
const submitBtnPlato = { ...submitBtn, background: '#10b981' };