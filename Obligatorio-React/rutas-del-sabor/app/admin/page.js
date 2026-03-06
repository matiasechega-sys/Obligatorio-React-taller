"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AltaLocalesComponent from '@/components/AltaLocalesComponent';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Si no hay token o es el de prueba, lo sacamos
    if (!token || token === "ABC-123-TOKEN") {
      alert("⚠️ Sesión inválida. Por favor, logueate de nuevo.");
      localStorage.clear();
      router.push("/login");
    }
  }, [router]);

  return (
    <div style={{ padding: '40px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <AltaLocalesComponent />
    </div>
  );
}