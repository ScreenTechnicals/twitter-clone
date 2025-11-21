import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMastoClient } from "../use-masto-client.hook";

export function useDeleteStatus() {
    const mastoClient = useMastoClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (statusId: string) => {
            if (!mastoClient) throw new Error("Masto client not initialized");
            return mastoClient.v1.statuses.$select(statusId).remove();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["home-timeline"] });
            queryClient.invalidateQueries({ queryKey: ["user-posts"] });
            queryClient.invalidateQueries({ queryKey: ["status-context"] });
        },
    });
}
