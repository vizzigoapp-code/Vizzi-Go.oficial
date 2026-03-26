import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { AppLayout } from "../components/layout";
import { supabase, type UserRole } from "../lib/supabase";

export default function Register() {
  const [location, setLocation] = useLocation();
  const tipoInicial = useMemo<UserRole>(() => {
    const url = new URL(window.location.href);
    const tipo = url.searchParams.get("tipo");
    if (tipo === "lojista" || tipo === "entregador") return tipo;
    return "cliente";
  }, []);

  const [role, setRole] = useState<UserRole>(tipoInicial);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [erro, setErro] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (password !== confirmPassword) {
      setErro("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErro(error.message);
      setLoading(false);
      return;
    }

    const userId = data.user?.id;
    if (userId) {
      await supabase.from("user_profiles").insert([
        {
          user_id: userId,
          role,
          name: role === "lojista" ? businessName || name : name,
          phone,
        },
      ]);

      if (role === "lojista") {
        await supabase.from("merchants").insert([
          {
            user_id: userId,
            business_name: businessName || name,
            contact_name: name,
            phone,
            delivery_radius_km: 5,
            delivery_fee: 5,
            delivery_enabled: true,
          },
        ]);
      }

      if (role === "entregador") {
        await supabase.from("delivery_users").insert([
          {
            user_id: userId,
            name,
            phone,
            vehicle,
            is_available: true,
          },
        ]);
      }
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <AppLayout title="Cadastro">
      <div className="card" style={{ maxWidth: 700, margin: "0 auto" }}>
        {success ? (
          <div className="center">
            <h2>Conta criada com sucesso</h2>
            <p className="muted">Verifique seu e-mail para confirmar o cadastro.</p>
            <div className="row-actions" style={{ justifyContent: "center" }}>
              <Link href="/entrar" className="btn btn-primary">
                Ir para login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form-grid">
            <div>
              <label className="label">Tipo de conta</label>
              <select className="select" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
                <option value="cliente">Cliente</option>
                <option value="lojista">Lojista</option>
                <option value="entregador">Entregador</option>
              </select>
            </div>

            <div className="form-grid-2">
              <div>
                <label className="label">{role === "lojista" ? "Responsável" : "Nome"}</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div>
                <label className="label">Telefone</label>
                <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            {role === "lojista" && (
              <div>
                <label className="label">Nome do negócio</label>
                <input
                  className="input"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>
            )}

            {role === "entregador" && (
              <div>
                <label className="label">Veículo</label>
                <input
                  className="input"
                  placeholder="Moto, bike, carro..."
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                />
              </div>
            )}

            <div className="form-grid-2">
              <div>
                <label className="label">E-mail</label>
                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div>
                <label className="label">Senha</label>
                <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="label">Confirmar senha</label>
              <input
                className="input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {erro ? <div className="notice">{erro}</div> : null}

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar conta"}
            </button>

            <div className="muted center">
              Já tem conta? <Link href="/entrar">Entrar</Link>
            </div>
          </form>
        )}
      </div>
    </AppLayout>
  );
}
