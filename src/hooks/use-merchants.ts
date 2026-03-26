import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase, type Merchant } from "../lib/supabase";
import { useAuth } from "./use-auth";

export function useMyMerchant() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["merchants", "me", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("merchants")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return (data as Merchant | null) ?? null;
    },
  });
}

export function useCreateMerchant() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (payload: Partial<Merchant>) => {
      const { data, error } = await supabase
        .from("merchants")
        .insert([
          {
            ...payload,
            user_id: user!.id,
            delivery_radius_km: payload.delivery_radius_km ?? 5,
            delivery_fee: payload.delivery_fee ?? 5,
            delivery_enabled: payload.delivery_enabled ?? true,
          },
        ])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Merchant;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchants", "me"] });
    },
  });
}

export function useUpdateMerchant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Merchant> & { id: string }) => {
      const { data, error } = await supabase
        .from("merchants")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Merchant;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchants", "me"] });
    },
  });
}
