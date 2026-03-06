import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, name, password } = body;

    // 1. Enviamos los datos a la API real de Railway
    const res = await fetch("https://api-react-taller-production.up.railway.app/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, name, password })
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || "Error al registrar en Railway" }, 
        { status: res.status }
      );
    }

    // 2. Si Railway lo creó bien, devolvemos éxito a nuestro frontend
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: "Error de conexión con el servidor de registro" }, 
      { status: 500 }
    );
  }
}