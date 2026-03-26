import { useState } from "react";
import { useLocation, Link } from "wouter";
import { AppLayout } from "../components/layout";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErro(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setLocation("/dashboard");
  }

  return (
    <AppLayout title="Entrar">
      <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
        <form onSubmit={handleSubmit} className="form-grid">
          <div>
            <label className="label">E-mail</label>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          <div>
            <label className="label">Senha</label>
            <input
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>

          {erro ? <div className="notice">{erro}</div> : null}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="muted center">
            Não tem conta? <Link href="/cadastro">Cadastre-se</Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
