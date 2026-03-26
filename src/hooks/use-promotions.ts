import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase, type Promotion } from "../lib/supabase";

export function useActivePromotions() {
  return useQuery({
    queryKey: ["promotions", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promotions")
        .select(`
          *,
          merchant:merchants(*)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return (data || []) as Promotion[];
    },
  });
}

export function useMyPromotions(merchantId?: string) {
  return useQuery({
    queryKey: ["promotions", "merchant", merchantId],
    enabled: !!merchantId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .eq("merchant_id", merchantId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return (data || []) as Promotion[];
    },
  });
}

export function useCreatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<Promotion>) => {
      const { data, error } = await supabase
        .from("promotions")
        .insert([payload])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Promotion;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["promotions", "active"] });
      queryClient.invalidateQueries({ queryKey: ["promotions", "merchant", data.merchant_id] });
    },
  });
}

export function useUpdatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Promotion> & { id: string }) => {
      const { data, error } = await supabase
        .from("promotions")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Promotion;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["promotions", "active"] });
      queryClient.invalidateQueries({ queryKey: ["promotions", "merchant", data.merchant_id] });
    },
  });
}

export function useDeletePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("promotions").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
  });
}
