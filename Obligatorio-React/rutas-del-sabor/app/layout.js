// app/layout.js
import Header from '@/components/Header';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={bodyStyle}>
        {/* El Header se carga una sola vez aquí y aparece en todas las páginas */}
        <Header />

        <main style={mainContainerStyle}>
          {children}
        </main>

        <footer style={footerStyle}>
          <div style={{ fontWeight: 'bold', color: '#ffffff', marginBottom: '10px' }}>
            📍 Rutas del Sabor
          </div>
          <p style={{ margin: 0, fontSize: '13px' }}>
            © 2026 Proyecto Gastronómico.
          </p>
        </footer>
      </body>
    </html>
  );
}

// --- ESTILOS RESTANTES (Solo lo que no es del Header) ---

const bodyStyle = { 
  fontFamily: "'Segoe UI', Roboto, sans-serif", 
  margin: 0, 
  backgroundColor: '#f8fafc', 
  color: '#334155', 
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column'
};

const mainContainerStyle = { 
  padding: '40px 20px', 
  maxWidth: '1100px', 
  margin: '0 auto', 
  flex: '1', // Esto hace que el footer siempre se quede abajo
  width: '100%'
};

const footerStyle = { 
  backgroundColor: '#1e293b', 
  color: '#94a3b8', 
  textAlign: 'center', 
  padding: '40px 20px', 
  marginTop: 'auto' // Empuja el footer al final si hay poco contenido
};