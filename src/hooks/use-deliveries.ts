import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase, type DeliveryRequest } from "../lib/supabase";
import { useAuth } from "./use-auth";

export function useAvailableDeliveries() {
  return useQuery({
    queryKey: ["deliveries", "available"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("delivery_requests")
        .select(`
          *,
          merchant:merchants(*)
        `)
        .eq("status", "available")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return (data || []) as DeliveryRequest[];
    },
  });
}

export function useMyMerchantDeliveries(merchantId?: string) {
  return useQuery({
    queryKey: ["deliveries", "merchant", merchantId],
    enabled: !!merchantId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("delivery_requests")
        .select("*")
        .eq("merchant_id", merchantId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return (data || []) as DeliveryRequest[];
    },
  });
}

export function useCreateDeliveryRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<DeliveryRequest>) => {
      const { data, error } = await supabase
        .from("delivery_requests")
        .insert([payload])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as DeliveryRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
    },
  });
}

export function useAcceptDelivery() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("delivery_requests")
        .update({ status: "accepted", accepted_by: user!.id })
        .eq("id", id)
        .eq("status", "available")
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as DeliveryRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
    },
  });
}
