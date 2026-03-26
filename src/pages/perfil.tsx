import { AppLayout } from "../components/layout";
import { useAuth } from "../hooks/use-auth";

export default function Perfil() {
  const { user, profile, role } = useAuth();

  return (
    <AppLayout title="Perfil">
      <div className="card">
        <div className="list">
          <div className="list-item"><strong>E-mail</strong><span>{user?.email || "-"}</span></div>
          <div className="list-item"><strong>Nome</strong><span>{profile?.name || "-"}</span></div>
          <div className="list-item"><strong>Telefone</strong><span>{profile?.phone || "-"}</span></div>
          <div className="list-item"><strong>Tipo</strong><span>{role || "-"}</span></div>
        </div>
      </div>
    </AppLayout>
  );
}
