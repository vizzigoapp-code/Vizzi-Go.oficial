import { useMemo, useState, useEffect } from "react";
import { AppLayout } from "../components/layout";
import { useActivePromotions } from "../hooks/use-promotions";

type UserCoords = { lat: number; lng: number } | null;

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function MapPage() {
  const { data: promotions = [] } = useActivePromotions();
  const [coords, setCoords] = useState<UserCoords>(null);
  const [locationText, setLocationText] = useState("Buscando sua localização...");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationText("Seu navegador não suporta geolocalização.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationText("Localização detectada.");
      },
      () => {
        setLocationText("Não foi possível detectar sua localização.");
      }
    );
  }, []);

  const sorted = useMemo(() => {
    if (!coords) return promotions;

    return [...promotions]
      .map((promo) => {
        const m = promo.merchant;
        const dist =
          m?.latitude != null && m?.longitude != null
            ? distanceKm(coords.lat, coords.lng, m.latitude, m.longitude)
            : null;

        return { ...promo, distance: dist };
      })
      .sort((a, b) => {
        if (a.distance == null) return 1;
        if (b.distance == null) return -1;
        return a.distance - b.distance;
      });
  }, [coords, promotions]);

  return (
    <AppLayout title="Ofertas próximas">
      <div className="notice">{locationText}</div>

      <div className="section-title">
        <h2>Lista de ofertas por proximidade</h2>
        <span className="muted">{sorted.length} resultados</span>
      </div>

      <div className="grid grid-2">
        {sorted.map((promo) => (
          <div key={promo.id} className="offer-card">
            <div className="badge">{promo.merchant?.business_name || "Loja"}</div>
            <h3>{promo.title}</h3>
            <p className="muted">{promo.description || "Oferta disponível agora."}</p>

            <div className="price-row">
              {promo.old_price ? <span className="old-price">R$ {promo.old_price}</span> : null}
              <span className="new-price">R$ {promo.new_price ?? 0}</span>
            </div>

            <div className="row-actions">
              {promo.merchant?.neighborhood ? <span className="badge">{promo.merchant.neighborhood}</span> : null}
              {(promo as any).distance != null ? (
                <span className="badge badge-success">{(promo as any).distance.toFixed(1)} km</span>
              ) : null}
              {promo.merchant?.delivery_enabled ? (
                <span className="badge badge-warning">
                  Entrega R$ {promo.merchant.delivery_fee ?? 0}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
