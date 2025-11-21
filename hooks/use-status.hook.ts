import { useQuery } from "@tanstack/react-query";
import { useMastoClient } from "./use-masto-client.hook";

export function useStatus(statusId: string) {
    const mastoClient = useMastoClient();

    return useQuery({
        queryKey: ["status", statusId],
        queryFn: async () => {
            if (!mastoClient) throw new Error("Masto client not initialized");
            return mastoClient.v1.statuses.$select(statusId).fetch();
        },
        enabled: !!mastoClient && !!statusId,
    });
}
