import { AppLayout } from "../components/layout";
import { useMyMerchant } from "../hooks/use-merchants";
import { useMyPromotions } from "../hooks/use-promotions";

export default function Promocoes() {
  const { data: merchant } = useMyMerchant();
  const { data: promotions = [] } = useMyPromotions(merchant?.id);

  return (
    <AppLayout title="Minhas promoções">
      {promotions.length === 0 ? (
        <div className="notice">Nenhuma promoção cadastrada ainda.</div>
      ) : (
        <div className="grid grid-2">
          {promotions.map((promo) => (
            <div className="offer-card" key={promo.id}>
              <h3>{promo.title}</h3>
              <p className="muted">{promo.description || "Sem descrição."}</p>
              <div className="price-row">
                {promo.old_price ? <span className="old-price">R$ {promo.old_price}</span> : null}
                <span className="new-price">R$ {promo.new_price ?? 0}</span>
              </div>
              <div className="row-actions">
                <span className={`badge ${promo.is_active ? "badge-success" : ""}`}>
                  {promo.is_active ? "Ativa" : "Inativa"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
