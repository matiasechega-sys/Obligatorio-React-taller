import { NextResponse } from 'next/server';

// Datos de prueba iniciales (simulando una base de datos)
let localesDB = [
  { id: 1, name: "La Pasiva", type: "restaurante", priceRange: "medio", city: "Montevideo", zone: "Centro", rating: 4 },
  { id: 2, name: "Café Brasilero", type: "cafeteria", priceRange: "alto", city: "Montevideo", zone: "Ciudad Vieja", rating: 5 }
];

// MÉTODO GET: Para listar los locales en la Home
export async function GET() {
  return NextResponse.json(localesDB);
}

// MÉTODO POST: Para crear un nuevo local (Protegido)
export async function POST(request) {
  try {
    // 1. Verificar el Token (Punto 1 y 4 de la letra)
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "No autorizado. Falta el token." }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (token !== "12345-token-abc") { // El token que definimos en el Login
      return NextResponse.json({ error: "Token inválido o expirado." }, { status: 403 });
    }

    // 2. Leer los datos del cuerpo (Exactamente como tu ejemplo)
    const body = await request.json();
    const { name, type, priceRange, city, zone, address, hours, photos } = body;

    // 3. Validación básica
    if (!name || !type || !priceRange || !zone) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    // 4. "Guardar" el local (lo agregamos al array temporal)
    const nuevoLocal = {
      id: localesDB.length + 1,
      name,
      type,
      priceRange,
      city,
      zone,
      address,
      hours,
      photos,
      rating: 0 // Empieza sin estrellas
    };

    localesDB.push(nuevoLocal);

    return NextResponse.json({ 
      mensaje: "Local creado con éxito", 
      local: nuevoLocal 
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}