import { NextResponse } from 'next/server';

const RAILWAY_URL = "https://api-react-taller-production.up.railway.app/api/dishes";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();
    
    const res = await fetch(`${RAILWAY_URL}${query ? `?${query}` : ''}`, {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' },
      cache: 'no-store'
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: "No se encontró token" }, { status: 401 });
    }

    // --- EL TRUCO PARA QUE RAILWAY NO RECHACE ---
    // Si el localId es muy alto o es un string (de un local creado localmente), 
    // Railway fallará. Para testear, si el ID no es numérico, podrías forzar un '1'.
    const idParaAPI = parseInt(body.localId);
    
    const cleanedData = {
      name: body.name?.trim(),
      category: body.category || "principal",
      localId: isNaN(idParaAPI) ? 1 : idParaAPI, // Si no es número, mandamos 1 por defecto
      city: body.city || "Montevideo",
      price: Number(body.price) || 0,
      description: body.description || ""
    };

    const res = await fetch(RAILWAY_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': authHeader.startsWith('Bearer ') ? authHeader : `Bearer ${authHeader}`
      },
      body: JSON.stringify(cleanedData)
    });

    const data = await res.json();

    // Log para que veas en tu terminal de VS Code qué dice Railway exactamente
    if (!res.ok) {
      console.log("❌ Error de Railway:", data);
      return NextResponse.json({ 
        error: data.message || "La API de Railway rechazó el plato",
        details: data 
      }, { status: res.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("🔥 Error crítico:", error);
    return NextResponse.json({ error: "Error interno del servidor proxy" }, { status: 500 });
  }
}