// app/api/locals/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const token = request.headers.get('authorization');

    // Validar que el token exista antes de disparar la petición
    if (!token) {
      return NextResponse.json({ error: "No hay token de autorización" }, { status: 401 });
    }

    const res = await fetch("https://api-react-taller-production.up.railway.app/api/locals", {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': token 
      },
      body: JSON.stringify(body)
    });

    // Intentamos obtener la data
    const data = await res.json();

    // Devolvemos la data con el mismo status code que nos dio el servidor original
    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    console.error("Error en Proxy Locals:", error);
    return NextResponse.json({ error: "Error interno en el servidor" }, { status: 500 });
  }
}