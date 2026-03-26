import { AppLayout } from "../components/layout";
import { useAuth } from "../hooks/use-auth";

export default function Admin() {
  const { isAdmin } = useAuth();

  return (
    <AppLayout title="Admin">
      {isAdmin ? (
        <div className="card">Área administrativa liberada.</div>
      ) : (
        <div className="notice">Acesso restrito.</div>
      )}
    </AppLayout>
  );
}
