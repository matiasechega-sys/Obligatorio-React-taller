import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Según tu letra: sin validaciones complejas, solo que existan
    if (!username || !password) {
      return NextResponse.json(
        { error: "Debes ingresar usuario y contraseña" }, 
        { status: 400 }
      );
    }

    // Aquí simulamos que se guarda. 
    // Devuelve un 201 (Created) que es lo correcto para registros.
    return NextResponse.json({ 
      mensaje: "Usuario registrado con éxito",
      usuario: username 
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: "Hubo un problema con el formato de los datos" }, 
      { status: 500 }
    );
  }
}