"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLocals, postPlato } from '../../services/apirestaurante';

export default function AltaPlatoPage() {
  const [locales, setLocales] = useState([]); // Inicializado como array vacío
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    category: 'principal',
    localId: '',
    city: 'Montevideo',
    price: '',
    description: ''
  });

  useEffect(() => {
    const cargarLocales = async () => {
      try {
        const data = await getLocals();
        // Validamos que data sea un array antes de setearlo
        const listaValida = Array.isArray(data) ? data : [];
        setLocales(listaValida);
        
        if (listaValida.length > 0) {
          // Usamos el ID o el nombre como fallback para evitar IDs nulos
          setForm(prev => ({ ...prev, localId: listaValida[0].id || listaValida[0].name }));
        }
      } catch (err) {
        console.error("Error cargando locales:", err);
        setLocales([]);
      }
    };
    cargarLocales();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const precioNum = parseFloat(form.price);
    if (isNaN(precioNum) || precioNum <= 0) {
      setError("Por favor, ingresa un precio válido.");
      setLoading(false);
      return;
    }

    // Aseguramos que el localId sea enviado (aunque sea un string numérico lo convertimos)
    const payload = {
      ...form,
      price: precioNum,
      localId: isNaN(Number(form.localId)) ? form.localId : Number(form.localId)
    };

    const res = await postPlato(payload);

    if (res.success) {
      alert("✅ Plato creado con éxito");
      router.push('/'); 
    } else {
      setError(res.error || "Error al crear el plato en la API");
    }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <button onClick={() => router.back()} style={backBtn}>← Volver</button>
      
      <h1 style={titleStyle}>🍲 Nuevo Plato</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>Sube tu creación gastronómica</p>

      {error && <div style={errorBox}>{error}</div>}

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputGroup}>
          <label style={labelStyle}>Nombre del Plato</label>
          <input 
            required 
            placeholder="Ej: Bife Ancho con Papas" 
            style={inputStyle}
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
              required 
              type="number" 
              placeholder="0.00" 
              style={inputStyle}
              value={form.price} 
              onChange={e => setForm({...form, price: e.target.value})}
            />
          </div>
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}>¿En qué local está?</label>
          <select 
            required
            style={inputStyle} 
            value={form.localId} 
            onChange={e => setForm({...form, localId: e.target.value})}
          >
            <option value="" disabled>Selecciona un local</option>
            {/* El operador ?. asegura que no rompa si locales es null */}
            {locales?.map((l, index) => (
              <option key={l.id || index} value={l.id || l.name}>
                {l.name} {l.zone ? `(${l.zone})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}>Ciudad</label>
          <input 
            required 
            style={inputStyle}
            value={form.city} 
            onChange={e => setForm({...form, city: e.target.value})}
          />
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}>Descripción</label>
          <textarea 
            required 
            placeholder="Describe los ingredientes..." 
            style={{ ...inputStyle, height: '100px', resize: 'none' }}
            value={form.description} 
            onChange={e => setForm({...form, description: e.target.value})}
          />
        </div>

        <button type="submit" disabled={loading} style={submitBtn}>
          {loading ? "Guardando..." : "Publicar Plato"}
        </button>
      </form>
    </div>
  );
}

// Estilos se mantienen igual...
const containerStyle = { maxWidth: '500px', margin: '40px auto', padding: '20px' };
const titleStyle = { color: '#2c3e50', fontSize: '28px', fontWeight: '800', textAlign: 'center', marginBottom: '5px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px', background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '8px' };
const rowStyle = { display: 'flex', gap: '15px' };
const labelStyle = { fontSize: '14px', fontWeight: '700', color: '#34495e' };
const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '15px', outline: 'none' };
const submitBtn = { padding: '15px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' };
const errorBox = { background: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' };
const backBtn = { background: 'none', border: 'none', color: '#e67e22', cursor: 'pointer', fontWeight: 'bold' };