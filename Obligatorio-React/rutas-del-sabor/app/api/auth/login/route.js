import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Leemos el cuerpo de la petición
    const body = await request.json();
    const { username, password } = body;

    // VALIDACIÓN SIMPLE (Para evitar errores de datos vacíos)
    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son obligatorios" }, 
        { status: 400 }
      );
    }

    // Según tu letra: Login simple, sin base de datos real aún
    // Devolvemos el token que pide el Punto 1
    return NextResponse.json({ 
      mensaje: "Login correcto", 
      token: "ABC-123-TOKEN" 
    }, { status: 200 });

  } catch (error) {
    // Si el JSON llega mal, evitamos que la API se rompa
    return NextResponse.json(
      { error: "Error al leer los datos enviados" }, 
      { status: 500 }
    );
  }
}