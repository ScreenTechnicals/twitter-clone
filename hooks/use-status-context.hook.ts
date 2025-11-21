import { useQuery } from "@tanstack/react-query";
import { useMastoClient } from "./use-masto-client.hook";

export function useStatusContext(statusId: string) {
    const mastoClient = useMastoClient();

    return useQuery({
        queryKey: ["status-context", statusId],
        queryFn: async () => {
            if (!mastoClient) throw new Error("Masto client not initialized");
            return mastoClient.v1.statuses.$select(statusId).context.fetch();
        },
        enabled: !!mastoClient && !!statusId,
    });
}
