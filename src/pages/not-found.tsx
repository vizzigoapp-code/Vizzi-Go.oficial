import { AppLayout } from "../components/layout";

export default function NotFound() {
  return (
    <AppLayout title="Página não encontrada">
      <div className="notice">A rota que você tentou acessar não existe.</div>
    </AppLayout>
  );
}
