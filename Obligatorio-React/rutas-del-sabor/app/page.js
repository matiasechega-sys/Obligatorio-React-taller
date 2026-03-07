"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; 
import { getLocals, getPlatos } from '../services/apirestaurante'; 
import ListadoPrincipal from '../components/ListadoPrincipal';
import DetalleLocalComponent from '../components/DetalleLocalComponent'; // Importamos el componente

export default function HomePage() { 
  const [locales, setLocales] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [vista, setVista] = useState("locales"); 
  const [loading, setLoading] = useState(true); 
  const [user, setUser] = useState(null);
  const [localSeleccionado, setLocalSeleccionado] = useState(null); // NUEVO ESTADO
  const router = useRouter();

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    try {
      const [dataLocals, dataPlatos] = await Promise.all([
        getLocals(),
        getPlatos()
      ]);
      setLocales(dataLocals);
      setPlatos(dataPlatos);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (!token) {
      router.push('/register');
    } else {
      if (storedUser) setUser(JSON.parse(storedUser));
      cargarDatos();
    }
  }, [router, cargarDatos]); 

  const localesFiltrados = locales.filter(l => {
    const term = filtro.toLowerCase().trim();
    return !term || (l.name || "").toLowerCase().includes(term) || 
           (l.zone || "").toLowerCase().includes(term) || 
           (l.type || "").toLowerCase().includes(term);
  });

  const platosFiltrados = platos.filter(p => {
    const term = filtro.toLowerCase().trim();
    return !term || (p.name || "").toLowerCase().includes(term) || 
           (p.category || "").toLowerCase().includes(term) || 
           (p.city || "").toLowerCase().includes(term) ||
           (p.description || "").toLowerCase().includes(term);
  });

  if (loading) return <div style={loaderStyle}>Sincronizando la Ruta del Sabor...</div>;

  // LOGICA PARA MOSTRAR DETALLE
  if (localSeleccionado) {
    return (
      <DetalleLocalComponent 
        local={localSeleccionado} 
        platos={platos.filter(p => String(p.localId) === String(localSeleccionado.id) || p.localId === localSeleccionado.name)} 
        onVolver={() => setLocalSeleccionado(null)} 
      />
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
      
      {/* HEADER CON NAVEGACIÓN */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', color: '#e67e22' }}>Bienvenido, {user?.username || 'Gourmet'}</h2>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => router.push('/perfil')} style={profileButtonStyle}>
            <div style={avatarStyle}>{user?.username?.charAt(0).toUpperCase() || "U"}</div>
            <span style={{ fontWeight: '600' }}>Mi Perfil</span>
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50', fontSize: '32px', fontWeight: '800' }}>📍 Mis Rutas</h1>
        
        <div style={tabsContainer}>
          <button 
            onClick={() => {setVista("locales"); setFiltro("");}} 
            style={vista === "locales" ? tabActive : tabInactive}
          >🏠 Locales ({localesFiltrados.length})</button>
          <button 
            onClick={() => {setVista("platos"); setFiltro("");}} 
            style={vista === "platos" ? tabActive : tabInactive}
          >🍲 Platos ({platosFiltrados.length})</button>
        </div>

        <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '500px', marginTop: '20px' }}>
          <input 
            placeholder={vista === "locales" ? "Busca por nombre, barrio o tipo..." : "Busca por plato, categoría o ciudad..."} 
            style={searchStyle}
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          {filtro && <button onClick={() => setFiltro("")} style={clearButtonStyle}>✕</button>}
        </div>
      </div>

      {/* RENDERIZADO CONDICIONAL */}
      {vista === "locales" ? (
        /* Pasamos una prop al listado para que sepa qué hacer al clickear un local */
        <ListadoPrincipal 
          locales={localesFiltrados} 
          onSeleccionarLocal={(local) => setLocalSeleccionado(local)} 
        />
      ) : (
        <div style={gridPlatos}>
          {platosFiltrados.length > 0 ? (
            platosFiltrados.map((plato, i) => (
              <div key={i} style={platoCard}>
                <span style={categoryBadge}>{plato.category}</span>
                <h3 style={{ margin: '10px 0 5px' }}>{plato.name}</h3>
                <p style={{ fontSize: '14px', color: '#666', height: '40px', overflow: 'hidden' }}>{plato.description}</p>
                <div style={platoFooter}>
                  <span style={{ fontWeight: '700', color: '#27ae60' }}>${plato.price}</span>
                  <span style={{ fontSize: '12px', color: '#95a5a6' }}>📍 {plato.city}</span>
                </div>
              </div>
            ))
          ) : (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#999' }}>No se encontraron platos.</p>
          )}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button onClick={cargarDatos} style={refreshButtonStyle}>🔄 Actualizar Todo</button>
      </div>
    </div>
  );
}

// ... (Estilos se mantienen igual)
const tabsContainer = { display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' };
const tabActive = { padding: '10px 20px', borderRadius: '50px', border: 'none', background: '#e67e22', color: 'white', fontWeight: 'bold', cursor: 'pointer' };
const tabInactive = { padding: '10px 20px', borderRadius: '50px', border: '1px solid #ddd', background: 'white', color: '#666', cursor: 'pointer' };
const gridPlatos = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' };
const platoCard = { padding: '20px', background: 'white', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f1f1' };
const categoryBadge = { fontSize: '10px', background: '#f1f2f6', padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase', fontWeight: 'bold', color: '#7f8c8d' };
const platoFooter = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #eee' };
const profileButtonStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', borderRadius: '50px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' };
const avatarStyle = { width: '25px', height: '25px', background: '#e67e22', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' };
const searchStyle = { width: '100%', padding: '16px 25px', borderRadius: '50px', border: '2px solid #f1f5f9', outline: 'none', fontSize: '16px' };
const clearButtonStyle = { position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#ccc', cursor: 'pointer' };
const loaderStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#e67e22', fontWeight: 'bold' };
const refreshButtonStyle = { background: 'none', border: '1px solid #ddd', color: '#888', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer' };