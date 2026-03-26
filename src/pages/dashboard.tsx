import { useState } from "react";
import { AppLayout } from "../components/layout";
import { useAuth } from "../hooks/use-auth";
import { useCreateMerchant, useMyMerchant, useUpdateMerchant } from "../hooks/use-merchants";
import { useMyPromotions, useCreatePromotion } from "../hooks/use-promotions";
import { useCreateDeliveryRequest, useMyMerchantDeliveries } from "../hooks/use-deliveries";

export default function Dashboard() {
  const { user, role, isLoading } = useAuth();
  const { data: merchant } = useMyMerchant();
  const { data: promotions = [] } = useMyPromotions(merchant?.id);
  const { data: deliveries = [] } = useMyMerchantDeliveries(merchant?.id);

  if (isLoading) {
    return <AppLayout title="Dashboard"><div className="notice">Carregando...</div></AppLayout>;
  }

  if (!user) {
    return <AppLayout title="Dashboard"><div className="notice">Faça login para acessar.</div></AppLayout>;
  }

  if (role === "entregador") {
    return (
      <AppLayout title="Painel do entregador">
        <div className="notice">
          Sua conta é de entregador. O próximo passo será exibir aqui as corridas disponíveis.
        </div>
      </AppLayout>
    );
  }

  if (role === "cliente") {
    return (
      <AppLayout title="Painel do cliente">
        <div className="notice">
          Sua conta é de cliente. Use o menu “Ofertas” para encontrar promoções próximas.
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Dashboard do lojista">
      <div className="kpi">
        <div className="stat">
          <span className="muted">Promoções ativas</span>
          <strong>{promotions.filter((p) => p.is_active).length}</strong>
        </div>
        <div className="stat">
          <span className="muted">Total de promoções</span>
          <strong>{promotions.length}</strong>
        </div>
        <div className="stat">
          <span className="muted">Entregas criadas</span>
          <strong>{deliveries.length}</strong>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: 18 }}>
        <MerchantCard merchant={merchant} />
        <PromotionForm merchantId={merchant?.id} />
      </div>

      <div className="grid grid-2" style={{ marginTop: 18 }}>
        <MerchantForm merchant={merchant} />
        <DeliveryForm merchantId={merchant?.id} merchant={merchant} />
      </div>
    </AppLayout>
  );
}

function MerchantCard({ merchant }: any) {
  return (
    <div className="card">
      <h3>Perfil do lojista</h3>
      {merchant ? (
        <div className="list">
          <div className="list-item"><strong>Negócio</strong><span>{merchant.business_name}</span></div>
          <div className="list-item"><strong>Contato</strong><span>{merchant.contact_name || "-"}</span></div>
          <div className="list-item"><strong>Telefone</strong><span>{merchant.phone || "-"}</span></div>
          <div className="list-item"><strong>Entrega</strong><span>{merchant.delivery_enabled ? "Ativa" : "Inativa"}</span></div>
          <div className="list-item"><strong>Raio</strong><span>{merchant.delivery_radius_km || 0} km</span></div>
          <div className="list-item"><strong>Taxa</strong><span>R$ {merchant.delivery_fee || 0}</span></div>
        </div>
      ) : (
        <div className="notice">Complete seu cadastro de lojista abaixo.</div>
      )}
    </div>
  );
}

function MerchantForm({ merchant }: any) {
  const createMerchant = useCreateMerchant();
  const updateMerchant = useUpdateMerchant();

  const [form, setForm] = useState({
    business_name: merchant?.business_name || "",
    contact_name: merchant?.contact_name || "",
    phone: merchant?.phone || "",
    category: merchant?.category || "Outros",
    neighborhood: merchant?.neighborhood || "",
    address: merchant?.address || "",
    notes: merchant?.notes || "",
    delivery_radius_km: merchant?.delivery_radius_km || 5,
    delivery_fee: merchant?.delivery_fee || 5,
    delivery_enabled: merchant?.delivery_enabled ?? true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (merchant?.id) {
      await updateMerchant.mutateAsync({ id: merchant.id, ...form });
      alert("Perfil atualizado.");
    } else {
      await createMerchant.mutateAsync(form);
      alert("Perfil criado.");
    }
  }

  return (
    <div className="card">
      <h3>{merchant ? "Editar negócio" : "Cadastrar negócio"}</h3>

      <form className="form-grid" onSubmit={handleSubmit}>
        <input className="input" placeholder="Nome do negócio" value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} />
        <input className="input" placeholder="Responsável" value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} />
        <input className="input" placeholder="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="input" placeholder="Categoria" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className="input" placeholder="Bairro" value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} />
        <input className="input" placeholder="Endereço" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <textarea className="textarea" placeholder="Sobre o negócio" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <input className="input" type="number" placeholder="Raio de entrega (km)" value={form.delivery_radius_km} onChange={(e) => setForm({ ...form, delivery_radius_km: Number(e.target.value) })} />
        <input className="input" type="number" placeholder="Taxa de entrega" value={form.delivery_fee} onChange={(e) => setForm({ ...form, delivery_fee: Number(e.target.value) })} />

        <label>
          <input
            type="checkbox"
            checked={form.delivery_enabled}
            onChange={(e) => setForm({ ...form, delivery_enabled: e.target.checked })}
          />{" "}
          Entrega ativa
        </label>

        <button className="btn btn-primary" type="submit">
          {merchant ? "Salvar perfil" : "Criar perfil"}
        </button>
      </form>
    </div>
  );
}

function PromotionForm({ merchantId }: { merchantId?: string }) {
  const createPromotion = useCreatePromotion();
  const [form, setForm] = useState({
    title: "",
    description: "",
    old_price: "",
    new_price: "",
    coupon_code: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!merchantId) {
      alert("Crie primeiro o perfil do lojista.");
      return;
    }

    await createPromotion.mutateAsync({
      merchant_id: merchantId,
      title: form.title,
      description: form.description,
      old_price: form.old_price ? Number(form.old_price) : null,
      new_price: form.new_price ? Number(form.new_price) : null,
      coupon_code: form.coupon_code || null,
      is_active: true,
    });

    setForm({
      title: "",
      description: "",
      old_price: "",
      new_price: "",
      coupon_code: "",
    });

    alert("Promoção criada.");
  }

  return (
    <div className="card">
      <h3>Nova promoção</h3>

      <form className="form-grid" onSubmit={handleSubmit}>
        <input className="input" placeholder="Título da promoção" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="textarea" placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="form-grid-2">
          <input className="input" type="number" placeholder="Preço antigo" value={form.old_price} onChange={(e) => setForm({ ...form, old_price: e.target.value })} />
          <input className="input" type="number" placeholder="Preço novo" value={form.new_price} onChange={(e) => setForm({ ...form, new_price: e.target.value })} />
        </div>
        <input className="input" placeholder="Cupom" value={form.coupon_code} onChange={(e) => setForm({ ...form, coupon_code: e.target.value })} />
        <button className="btn btn-primary" type="submit">Publicar promoção</button>
      </form>
    </div>
  );
}

function DeliveryForm({ merchantId, merchant }: any) {
  const createDelivery = useCreateDeliveryRequest();
  const [title, setTitle] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!merchantId || !merchant) {
      alert("Crie primeiro o perfil do lojista.");
      return;
    }

    await createDelivery.mutateAsync({
      merchant_id: merchantId,
      title: title || "Nova entrega disponível",
      pickup_address: merchant.address || "",
      pickup_latitude: merchant.latitude || null,
      pickup_longitude: merchant.longitude || null,
      delivery_radius_km: merchant.delivery_radius_km || 5,
      delivery_fee: merchant.delivery_fee || 5,
      status: "available",
    });

    setTitle("");
    alert("Entrega publicada para entregadores.");
  }

  return (
    <div className="card">
      <h3>Publicar entrega</h3>
      <form className="form-grid" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Título da entrega"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="notice">
          O entregador verá a corrida com o valor definido no seu perfil.
        </div>
        <button className="btn btn-primary" type="submit">
          Publicar entrega
        </button>
      </form>
    </div>
  );
}
