import { NextResponse } from 'next/server';

const RAILWAY_URL = "https://api-react-taller-production.up.railway.app/api/locals";

export async function GET(request) {
  try {
    const token = request.headers.get('authorization');
    const res = await fetch(RAILWAY_URL, {
      method: 'GET',
      headers: { 
        'Authorization': token || '',
        'Cache-Control': 'no-cache' 
      },
      cache: 'no-store'
    });

    const text = await res.text();
    // Si Railway devuelve algo vacío, mandamos array para que el inicio no explote
    const data = text ? JSON.parse(text) : [];
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en GET API:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const token = request.headers.get('authorization');

    if (!token) {
      return NextResponse.json({ error: "No autorizado (falta token)" }, { status: 401 });
    }

    // --- NORMALIZACIÓN PARA RAILWAY ---
    // Aseguramos que los nombres coincidan con lo que espera tu ListadoPrincipal
    const cleanedData = {
      name: body.name ? body.name.trim() : "Local sin nombre",
      type: (body.type || "restaurante").toLowerCase(),
      priceRange: (body.priceRange || "medio").toLowerCase().trim(),
      zone: (body.zone || "Sin Zona").trim(),
      address: (body.address || "Dirección no especificada").trim(),
      city: "Montevideo",
      hours: "09:00 - 23:00",
      photos: body.photos && body.photos.length > 0 ? body.photos : ["https://via.placeholder.com/300"]
    };

    const res = await fetch(RAILWAY_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': token 
      },
      body: JSON.stringify(cleanedData)
    });

    const responseText = await res.text();
    
    if (!res.ok) {
      const errorData = responseText ? JSON.parse(responseText) : {};
      return NextResponse.json({ error: errorData.message || "Error en el servidor de Railway" }, { status: res.status });
    }

    return NextResponse.json(JSON.parse(responseText), { status: 201 });

  } catch (error) {
    console.error("Error en POST API:", error);
    return NextResponse.json({ error: "Fallo de conexión total" }, { status: 500 });
  }
}