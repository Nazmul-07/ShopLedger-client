import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/axios";
import { saleService } from "@/services/sale.service";
import type { CreateSaleInput, UpdateSaleInput } from "@/types/sale";

export const SALE_KEYS = {
  all: ["sales"] as const,
};

export function useSales() {
  return useQuery({
    queryKey: SALE_KEYS.all,
    queryFn: saleService.getAll,
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSaleInput) => saleService.create(payload),
    onSuccess: () => {
      toast.success("Sale recorded successfully");
      queryClient.invalidateQueries({ queryKey: SALE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to record sale"));
    },
  });
}

export function useUpdateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSaleInput }) =>
      saleService.update(id, payload),
    onSuccess: () => {
      toast.success("Sale updated successfully");
      queryClient.invalidateQueries({ queryKey: SALE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update sale"));
    },
  });
}

export function useDeleteSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => saleService.remove(id),
    onSuccess: () => {
      toast.success("Sale deleted and stock restored");
      queryClient.invalidateQueries({ queryKey: SALE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to delete sale"));
    },
  });
}
