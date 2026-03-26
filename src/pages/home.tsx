import { Link } from "wouter";
import { AppLayout } from "../components/layout";
import { useActivePromotions } from "../hooks/use-promotions";

export default function Home() {
  const { data: promotions = [] } = useActivePromotions();

  return (
    <AppLayout>
      <section className="hero">
        <div className="hero-card">
          <span className="badge">Vitrine inteligente local</span>
          <h1>Promoções perto do cliente. Entregas diretas com menos custo.</h1>
          <p>
            O Vizzi-Go conecta cliente, lojista e entregador em um só fluxo.
            O cliente encontra ofertas próximas. O lojista divulga promoções e
            chama entregadores sem atravessadores.
          </p>

          <div className="hero-actions">
            <Link href="/mapa" className="btn btn-primary">
              Ver ofertas perto de mim
            </Link>
            <Link href="/cadastro?tipo=lojista" className="btn">
              Sou lojista
            </Link>
            <Link href="/cadastro?tipo=entregador" className="btn">
              Sou entregador
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <h3>Como o app gera valor</h3>
          <div className="list">
            <div className="list-item">
              <div>
                <strong>Cliente</strong>
                <div className="muted">Encontra promoções e faz contato direto.</div>
              </div>
            </div>
            <div className="list-item">
              <div>
                <strong>Lojista</strong>
                <div className="muted">Divulga oferta e reduz custo com plataforma.</div>
              </div>
            </div>
            <div className="list-item">
              <div>
                <strong>Entregador</strong>
                <div className="muted">Vê corridas próximas com valor já definido.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-title">
        <h2>Promoções ativas</h2>
        <span className="muted">{promotions.length} encontradas</span>
      </div>

      <section className="grid grid-3">
        {promotions.length === 0 ? (
          <div className="notice">Nenhuma promoção ativa ainda.</div>
        ) : (
          promotions.slice(0, 6).map((promo) => (
            <article className="offer-card" key={promo.id}>
              <div className="badge">{promo.merchant?.business_name || "Loja parceira"}</div>
              <h3>{promo.title}</h3>
              <p className="muted">{promo.description || "Oferta disponível agora."}</p>

              <div className="price-row">
                {promo.old_price ? <span className="old-price">R$ {promo.old_price}</span> : null}
                <span className="new-price">R$ {promo.new_price ?? 0}</span>
              </div>

              <div className="row-actions">
                {promo.coupon_code ? <span className="badge">Cupom: {promo.coupon_code}</span> : null}
                {promo.merchant?.delivery_enabled ? (
                  <span className="badge badge-success">
                    Entrega R$ {promo.merchant.delivery_fee ?? 0}
                  </span>
                ) : null}
              </div>
            </article>
          ))
        )}
      </section>
    </AppLayout>
  );
}
