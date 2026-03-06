import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son obligatorios" }, 
        { status: 400 }
      );
    }

    // LLAMADA A LA API REAL DE RAILWAY
    const res = await fetch("https://api-react-taller-production.up.railway.app/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || "Credenciales incorrectas en Railway" }, 
        { status: res.status }
      );
    }

    // Devolvemos la respuesta real (que incluye el token verdadero)
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "Error de conexión con el servidor externo" }, 
      { status: 500 }
    );
  }
}