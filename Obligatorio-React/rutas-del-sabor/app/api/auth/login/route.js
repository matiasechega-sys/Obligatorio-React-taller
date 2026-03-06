import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // 1. Validación básica
    if (!username || !password) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    // 2. Petición a Railway
    const res = await fetch("https://api-react-taller-production.up.railway.app/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    // 3. Verificamos si la respuesta es JSON antes de parsear
    const contentType = res.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const textError = await res.text();
      return NextResponse.json({ error: "La API no respondió un JSON", detallle: textError }, { status: res.status });
    }

    // 4. Manejo de errores de Railway
    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || data.error || "Credenciales inválidas" }, 
        { status: res.status }
      );
    }

    // 5. Éxito
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Error en el Proxy de Login:", error);
    return NextResponse.json(
      { error: "Fallo total de conexión con Railway" }, 
      { status: 500 }
    );
  }
}