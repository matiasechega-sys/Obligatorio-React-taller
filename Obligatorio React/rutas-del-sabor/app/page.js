 "use client";
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [locales, setLocales] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");

  // Simulamos la carga de datos (esto luego vendrá de tu fetch a /api/locales)
  useEffect(() => {
    const datosPrueba = [
      { id: 1, nombre: "La Pasiva", tipo: "Restaurante", zona: "Centro", precio: "Medio", calificacion: 4 },
      { id: 2, nombre: "Starbucks", tipo: "Cafetería", zona: "Pocitos", precio: "Alto", calificacion: 5 },
      { id: 3, nombre: "Bar Facal", tipo: "Bar", zona: "Centro", precio: "Medio", calificacion: 4 },
      { id: 4, nombre: "Food Truck Burger", tipo: "Food Truck", zona: "Parque Rodó", precio: "Económico", calificacion: 3 },
    ];
    setLocales(datosPrueba);
  }, []);

  // Lógica de filtrado
  const localesFiltrados = locales.filter(local => {
    const coincideNombre = local.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideTipo = filtroTipo === "Todos" || local.tipo === filtroTipo;
    return coincideNombre && coincideTipo;
  });

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#e67e22' }}>🍕 Rutas del Sabor</h1>
        <p>Descubre los mejores lugares para comer en la ciudad</p>
      </header>

      {/* SECCIÓN DE FILTROS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Buscar por nombre..." 
          style={{ padding: '10px', flex: '1', borderRadius: '5px', border: '1px solid #ccc' }}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select 
          style={{ padding: '10px', borderRadius: '5px' }}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="Todos">Todos los tipos</option>
          <option value="Restaurante">Restaurante</option>
          <option value="Cafetería">Cafetería</option>
          <option value="Bar">Bar</option>
          <option value="Food Truck">Food Truck</option>
        </select>
      </div>

      {/* GRILLA DE LOCALES */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px' 
      }}>
        {localesFiltrados.map(local => (
          <div key={local.id} style={{ 
            border: '1px solid #eee', 
            borderRadius: '10px', 
            padding: '15px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{local.nombre}</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>📍 {local.zona}</p>
            <p><strong>Tipo:</strong> {local.tipo}</p>
            <p><strong>Precio:</strong> {local.precio}</p>
            <p><strong>Puntuación:</strong> {"⭐".repeat(local.calificacion)}</p>
            <button 
              style={{ 
                width: '100%', 
                padding: '10px', 
                backgroundColor: '#e67e22', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
              onClick={() => window.location.href = `/local/${local.id}`}
            >
              Ver menú y detalles
            </button>
          </div>
        ))}
      </div>

      {localesFiltrados.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>No se encontraron locales que coincidan con tu búsqueda.</p>
      )}
    </div>
  );
}