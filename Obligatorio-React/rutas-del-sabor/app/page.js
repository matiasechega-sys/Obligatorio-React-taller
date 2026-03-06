"use client"; "use client"; // <--- ESTO ES VITAL para Vercel y Next.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { getLocals } from '../services/apirestaurante'; 
import ListadoPrincipal from '../components/ListadoPrincipal';

export default function HomePage() { 
  const [locales, setLocales] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Si no hay token, mandamos al registro
    if (!token) {
      router.push('/register');
      return;
    }

    const cargarDatos = async () => {
      try {
        const data = await getLocals();
        // Normalizamos la respuesta por si la API cambia el formato
        const lista = Array.isArray(data) ? data : (data?.locals || []);
        setLocales(lista);
      } catch (error) {
        console.error("Error cargando locales:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [router]);

  // Filtro en tiempo real
  const filtrados = locales.filter(l => 
    l.name?.toLowerCase().includes(filtro.toLowerCase()) || 
    l.type?.toLowerCase().includes(filtro.toLowerCase()) || 
    l.zone?.toLowerCase().includes(filtro.toLowerCase())
  );

  // Mientras verifica el token y carga datos
  if (loading) {
    return <div style={loaderStyle}>Cargando experiencia...</div>;
  }

  return (
    <div style={{ minHeight: '80vh', padding: '20px' }}>
      
      {/* CABECERA Y BUSCADOR */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#2c3e50', fontSize: '36px', fontWeight: '800' }}>📍 Rutas del Sabor</h1>
        <p style={{ color: '#7f8c8d' }}>Busca y descubre los mejores lugares para comer</p>
        <input 
          placeholder="Buscar restaurante, zona, o tipo..." 
          style={searchStyle}
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {/* USO DEL COMPONENTE DE LISTADO */}
      <ListadoPrincipal locales={filtrados} />

      {/* MENSAJE SI NO HAY RESULTADOS */}
      {filtrados.length === 0 && (
        <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '40px' }}>
          No se encontraron locales que coincidan con "{filtro}".
        </p>
      )}
    </div>
  );
}

// ESTILOS
const loaderStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', fontSize: '20px', color: '#e67e22', fontWeight: 'bold' };
const searchStyle = { width: '100%', maxWidth: '500px', padding: '16px', borderRadius: '50px', border: '2px solid #e67e22', outline: 'none', marginTop: '20px', boxShadow: '0 4px 12px rgba(230, 126, 34, 0.1)', fontSize: '16px' };