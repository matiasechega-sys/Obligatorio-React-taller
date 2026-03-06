"use client"; 
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
    if (!token) {
      router.push('/register');
      return;
    }

    const cargarDatos = async () => {
      try {
        const data = await getLocals();
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

  const filtrados = locales.filter(l => 
    l.name?.toLowerCase().includes(filtro.toLowerCase()) || 
    l.type?.toLowerCase().includes(filtro.toLowerCase()) || 
    l.zone?.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading && locales.length === 0) {
    return <div style={loaderStyle}>Cargando experiencia...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f8fafc' }}>
      
      {/* CABECERA Y BUSCADOR */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#2c3e50', fontSize: '36px', fontWeight: '800' }}>📍 Rutas del Sabor</h1>
        <p style={{ color: '#7f8c8d' }}>Busca y descubre los mejores lugares</p>
        <input 
          placeholder="Buscar restaurante, zona, o tipo..." 
          style={searchStyle}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {/* USO DEL COMPONENTE */}
      <ListadoPrincipal locales={filtrados} />

      {/* MENSAJE DE RESULTADOS VACÍOS */}
      {filtrados.length === 0 && !loading && (
        <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '40px' }}>
          No se encontraron locales que coincidan con tu búsqueda.
        </p>
      )}
    </div>
  );
}

// Estilos mínimos que se quedan en la página
const loaderStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px', color: '#e67e22', fontWeight: 'bold' };
const searchStyle = { width: '100%', maxWidth: '500px', padding: '16px', borderRadius: '50px', border: '2px solid #e67e22', outline: 'none', marginTop: '20px', boxShadow: '0 4px 12px rgba(230, 126, 34, 0.1)' };