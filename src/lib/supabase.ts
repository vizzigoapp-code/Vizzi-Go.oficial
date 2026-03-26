import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

export type UserRole = "cliente" | "lojista" | "entregador";

export type UserProfile = {
  id: string;
  user_id: string;
  role: UserRole;
  name?: string | null;
  phone?: string | null;
  created_at: string;
};

export type Merchant = {
  id: string;
  user_id: string;
  business_name: string;
  contact_name?: string | null;
  phone?: string | null;
  email?: string | null;
  instagram?: string | null;
  category?: string | null;
  neighborhood?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  notes?: string | null;
  delivery_radius_km?: number | null;
  delivery_fee?: number | null;
  delivery_enabled?: boolean | null;
  created_at: string;
};

export type Promotion = {
  id: string;
  merchant_id: string;
  title: string;
  description?: string | null;
  old_price?: number | null;
  new_price?: number | null;
  coupon_code?: string | null;
  expires_at?: string | null;
  image_url?: string | null;
  is_active: boolean;
  created_at: string;
  merchant?: Merchant;
};

export type DeliveryRequestStatus =
  | "available"
  | "accepted"
  | "cancelled"
  | "completed";

export type DeliveryRequest = {
  id: string;
  merchant_id: string;
  title: string;
  pickup_address?: string | null;
  pickup_latitude?: number | null;
  pickup_longitude?: number | null;
  delivery_radius_km: number;
  delivery_fee: number;
  status: DeliveryRequestStatus;
  accepted_by?: string | null;
  created_at: string;
  merchant?: Merchant;
};
