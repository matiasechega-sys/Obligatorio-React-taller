"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AltaLocalesComponent from '@/components/AltaLocalesComponent';

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Verificamos si el token existe y es válido (no el de prueba)
    if (!token || token === "ABC-123-TOKEN") {
      alert("⚠️ Sesión inválida. Por favor, logueate de nuevo.");
      localStorage.clear();
      router.push("/login");
    } else {
      // Si todo está bien, permitimos ver el contenido
      setAuthorized(true);
    }
  }, [router]);

  // Si aún no validamos el token, no mostramos nada (o un spinner)
  if (!authorized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Verificando sesión...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <button 
        onClick={() => router.push('/')}
        style={backButtonStyle}
      >
        ← Volver al Inicio
      </button>
      
      <AltaLocalesComponent />
    </div>
  );
}

const backButtonStyle = {
  marginBottom: '20px',
  padding: '10px 15px',
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  color: '#2c3e50'
};