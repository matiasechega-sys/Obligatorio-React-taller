export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: 'sans-serif', margin: 0 }}>
        <nav style={{ padding: '20px', background: '#333', color: 'white', display: 'flex', gap: '20px' }}>
          <a href="/" style={{ color: 'white', textDecoration: 'none' }}>🏠 Inicio</a>
          <a href="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</a>
          <a href="/register" style={{ color: 'white', textDecoration: 'none' }}>Registro</a>
        </nav>
        <main style={{ padding: '20px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}