import { Link, useLocation } from "wouter";
import { useAuth } from "../hooks/use-auth";

export function AppLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const { user, role, signOut } = useAuth();
  const [location] = useLocation();

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link href="/">
            <div className="brand">Vizzi-Go</div>
          </Link>

          <nav className="nav">
            <Link href="/">Início</Link>
            <Link href="/mapa">Ofertas</Link>
            {user && <Link href="/dashboard">Dashboard</Link>}
            {user && <Link href="/perfil">Perfil</Link>}
            {!user && <Link href="/entrar">Entrar</Link>}
            {!user && <Link href="/cadastro">Cadastrar</Link>}
            {user && (
              <button onClick={signOut}>
                Sair {role ? `(${role})` : ""}
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="container">
        {title && (
          <div className="section-title">
            <h2>{title}</h2>
            <span className="muted">{location}</span>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
