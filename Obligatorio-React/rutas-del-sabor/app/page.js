"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; 
import { getLocals, getPlatos } from '../services/apirestaurante'; 
import ListadoPrincipal from '../components/ListadoPrincipal';
import DetalleLocalComponent from '../components/DetalleLocalComponent';
// 1. IMPORTAMOS EL NUEVO COMPONENTE
import DetallePlatoComponent from '../components/DetallePlatoComponent';

export default function HomePage() { 
  const [locales, setLocales] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [vista, setVista] = useState("locales"); 
  const [loading, setLoading] = useState(true); 
  const [user, setUser] = useState(null);
  
  // ESTADOS DE SELECCIÓN
  const [localSeleccionado, setLocalSeleccionado] = useState(null);
  // 2. AGREGAMOS ESTADO PARA EL PLATO
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null);
  
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

  // Filtros unificados
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
           (p.city || "").toLowerCase().includes(term);
  });

  if (loading) return <div style={loaderStyle}>Sincronizando la Ruta del Sabor...</div>;

  // --- RENDERIZADO DE VISTAS DE DETALLE ---
  
  if (localSeleccionado) {
    return (
      <DetalleLocalComponent 
        local={localSeleccionado} 
        platos={platos.filter(p => String(p.localId) === String(localSeleccionado.id) || p.localId === localSeleccionado.name)} 
        onVolver={() => setLocalSeleccionado(null)} 
      />
    );
  }

  // 3. MOSTRAR DETALLE DEL PLATO SI HAY UNO SELECCIONADO
  if (platoSeleccionado) {
    return (
      <DetallePlatoComponent 
        plato={platoSeleccionado} 
        onVolver={() => setPlatoSeleccionado(null)} 
      />
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', color: '#e67e22', fontWeight: '800' }}>
          Hola, {user?.username || 'Gamer'} 👋
        </h2>
        
        <button onClick={() => router.push('/perfil')} style={profileButtonStyle}>
          <div style={avatarStyle}>{user?.username?.charAt(0).toUpperCase() || "L"}</div>
          <span style={{ fontWeight: '600' }}>Mi Perfil</span>
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50', fontSize: '36px', fontWeight: '900', letterSpacing: '-1px' }}>Ruta del Sabor</h1>
        
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

        {/* BUSCADOR */}
        <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '500px', marginTop: '20px' }}>
          <input 
            placeholder={vista === "locales" ? "Busca por nombre, barrio o tipo..." : "Busca por plato o ciudad..."} 
            style={searchStyle}
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          {filtro && <button onClick={() => setFiltro("")} style={clearButtonStyle}>✕</button>}
        </div>
      </div>

      {/* 4. MODIFICAMOS EL LISTADO PARA QUE MANEJE AMBOS CLICS */}
      <ListadoPrincipal 
        datos={vista === "locales" ? localesFiltrados : platosFiltrados} 
        tipo={vista}
        onSeleccionarLocal={(local) => setLocalSeleccionado(local)} 
        onSeleccionarPlato={(plato) => setPlatoSeleccionado(plato)} 
      />

      <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '40px' }}>
        <button onClick={cargarDatos} style={refreshButtonStyle}>🔄 Sincronizar Datos</button>
      </div>
    </div>
  );
}

// Estilos (se mantienen los tuyos)
const tabsContainer = { display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' };
const tabActive = { padding: '12px 25px', borderRadius: '50px', border: 'none', background: '#e67e22', color: 'white', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(230,126,34,0.3)' };
const tabInactive = { padding: '12px 25px', borderRadius: '50px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer' };
const profileButtonStyle = { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 18px', borderRadius: '50px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' };
const avatarStyle = { width: '28px', height: '28px', background: '#e67e22', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' };
const searchStyle = { width: '100%', padding: '16px 25px', borderRadius: '50px', border: '2px solid #f1f5f9', outline: 'none', fontSize: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' };
const clearButtonStyle = { position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '18px' };
const loaderStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#e67e22', fontSize: '20px', fontWeight: '900', letterSpacing: '1px' };
const refreshButtonStyle = { background: 'white', border: '1px solid #e2e8f0', color: '#64748b', padding: '10px 20px', borderRadius: '15px', cursor: 'pointer', fontWeight: '600' };