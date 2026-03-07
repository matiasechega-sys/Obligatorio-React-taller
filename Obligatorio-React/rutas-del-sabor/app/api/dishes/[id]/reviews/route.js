import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const { id } = params; 
    
    // Validación de seguridad para IDs inválidos antes de llamar a Railway
    if (!id || id === 'undefined' || id.length < 5) {
      return NextResponse.json({ error: "ID de recurso no válido" }, { status: 400 });
    }

    const body = await request.json();
    const token = request.headers.get('authorization');

    // Llamada a Railway (Asegúrate que la URL sea /api/...)
    const res = await fetch(`https://api-react-taller-production.up.railway.app/api/dishes/${id}/reviews`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': token 
      },
      body: JSON.stringify({ 
        rating: Number(body.rating), 
        comment: body.comment 
      })
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    console.error("Error en Route Handler:", error);
    return NextResponse.json({ error: "Error interno en el servidor" }, { status: 500 });
  }
}