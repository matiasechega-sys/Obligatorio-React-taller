"use client";

import { useState, useEffect } from 'react';
import { getLocals, postPlato } from '../services/apirestaurante';

export default function AltaPlatos({ onExito }) {
  const [locales, setLocales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    name: '',
    category: 'principal',
    localId: '',
    city: 'Montevideo',
    price: '',
    description: ''
  });

  // Carga de locales para el selector
  useEffect(() => {
    const cargar = async () => {
      const data = await getLocals();
      setLocales(data);
      if (data.length > 0) {
        // Inicializamos con el primer local de la lista
        setForm(f => ({ ...f, localId: data[0].id || data[0].name }));
      }
    };
    cargar();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validación de campos requeridos
    if (!form.name || !form.localId || !form.price) {
      setError("Por favor completa los campos obligatorios.");
      setLoading(false);
      return;
    }

    const res = await postPlato(form);

    if (res.success || !res.error) {
      alert("✅ Plato creado con éxito");
      // Opcional: limpiar formulario
      setForm({ ...form, name: '', price: '', description: '' });
      if (onExito) onExito();
    } else {
      setError(res.error || "Hubo un problema al guardar el plato.");
    }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>🍲 Alta de Platos</h2>
      {error && <div style={errorAlert}>{error}</div>}

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={groupStyle}>
          <label style={labelStyle}>Nombre del Manjar</label>
          <input 
            required style={inputStyle}
            placeholder="Ej: Milanesa a la Napolitana"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
          />
        </div>

        <div style={rowStyle}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Categoría</label>
            <select 
              style={inputStyle}
              value={form.category}
              onChange={e => setForm({...form, category: e.target.value})}
            >
              <option value="entrada">Entrada</option>
              <option value="principal">Principal</option>
              <option value="postre">Postre</option>
              <option value="bebida">Bebida</option>
              <option value="otros">Otros</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Precio ($)</label>
            <input 
              required type="number" style={inputStyle}
              placeholder="0.00"
              value={form.price}
              onChange={e => setForm({...form, price: e.target.value})}
            />
          </div>
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>¿En qué local lo probaste?</label>
          <select 
            required style={inputStyle}
            value={form.localId}
            onChange={e => setForm({...form, localId: e.target.value})}
          >
            <option value="" disabled>Seleccionar local...</option>
            {locales.map((l, i) => (
              <option key={l.id || `loc-${i}`} value={l.id || l.name}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>Ciudad</label>
          <input 
            required style={inputStyle}
            value={form.city}
            onChange={e => setForm({...form, city: e.target.value})}
          />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>Descripción / Reseña</label>
          <textarea 
            style={{...inputStyle, height: '80px', resize: 'none'}}
            placeholder="¿Qué tal estaba? Cuéntanos detalles..."
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
          />
        </div>

        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? "Registrando..." : "Guardar Plato"}
        </button>
      </form>
    </div>
  );
}

// --- ESTILOS ---
const containerStyle = { background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' };
const titleStyle = { margin: '0 0 20px 0', color: '#2c3e50', textAlign: 'center' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const groupStyle = { display: 'flex', flexDirection: 'column', gap: '5px' };
const rowStyle = { display: 'flex', gap: '15px' };
const labelStyle = { fontSize: '14px', fontWeight: 'bold', color: '#555' };
const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '15px', outline: 'none' };
const btnStyle = { padding: '15px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };
const errorAlert = { padding: '10px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' };