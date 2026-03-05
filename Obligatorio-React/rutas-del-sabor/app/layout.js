import Link from 'next/link';

export const metadata = {
  title: 'Rutas del Sabor | Guía Gastronómica',
  description: 'Encuentra los mejores locales de comida y café',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={bodyStyle}>
        
        {/* BARRA DE NAVEGACIÓN PRINCIPAL */}
        <nav style={navStyle}>
          <div style={navContainer}>
            {/* Logo con el Pin de ubicación que pediste */}
            <Link href="/" style={logoStyle}>
              <span style={{ fontSize: '24px' }}>📍</span> 
              <span style={logoTextStyle}>Rutas del Sabor</span>
            </Link>
            
            <div style={navLinksStyle}>
              <Link href="/" style={linkStyle}>Inicio</Link>
              
              {/* Enlace al panel de administración que creamos recién */}
              <Link href="/admin" style={linkStyle}>Admin</Link>
              
              <Link href="/login" style={linkStyle}>Ingresar</Link>
              
              {/* Botón de Registro resaltado */}
              <Link href="/register" style={registerButtonStyle}>
                Registrarse
              </Link>
            </div>
          </div>
        </nav>

        {/* CONTENEDOR DE LAS PÁGINAS */}
        <main style={mainContainerStyle}>
          {children}
        </main>

        {/* PIE DE PÁGINA */}
        <footer style={footerStyle}>
          <div style={{ fontWeight: 'bold', color: '#ffffff', marginBottom: '10px' }}>
            📍 Rutas del Sabor
          </div>
          <p style={{ margin: 0, fontSize: '13px' }}>
            © 2026 Proyecto Gastronómico. Creado para amantes del buen comer.
          </p>
        </footer>

      </body>
    </html>
  );
}

// --- ESTILOS DEL LAYOUT ---

const bodyStyle = {
  fontFamily: "'Segoe UI', Roboto, sans-serif",
  margin: 0,
  backgroundColor: '#f8fafc', // Un gris azulado muy suave y limpio
  color: '#334155',
  minHeight: '100vh',
};

const navStyle = {
  backgroundColor: '#ffffff',
  height: '75px',
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
};

const navContainer = {
  width: '100%',
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '0 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const logoStyle = {
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const logoTextStyle = {
  color: '#e67e22',
  fontSize: '22px',
  fontWeight: '800',
  letterSpacing: '-0.5px',
};

const navLinksStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '25px',
};

const linkStyle = {
  color: '#64748b',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: '600',
  transition: 'color 0.2s ease',
};

const registerButtonStyle = {
  backgroundColor: '#e67e22',
  color: '#ffffff',
  padding: '10px 20px',
  borderRadius: '12px',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 'bold',
  boxShadow: '0 4px 10px rgba(230, 126, 34, 0.25)',
  transition: 'transform 0.2s ease',
};

const mainContainerStyle = {
  padding: '40px 20px',
  maxWidth: '1100px',
  margin: '0 auto',
  minHeight: 'calc(100vh - 200px)',
};

const footerStyle = {
  backgroundColor: '#1e293b', // Azul oscuro profundo
  color: '#94a3b8',
  textAlign: 'center',
  padding: '40px 20px',
  marginTop: '60px',
};