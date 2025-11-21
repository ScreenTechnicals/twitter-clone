import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMastoClient } from "../use-masto-client.hook";

type EditStatusParams = {
    statusId: string;
    status: string;
    spoilerText?: string;
    sensitive?: boolean;
    mediaIds?: string[];
};

export function useEditStatus() {
    const mastoClient = useMastoClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ statusId, status, spoilerText, sensitive, mediaIds }: EditStatusParams) => {
            if (!mastoClient) throw new Error("Masto client not initialized");
            return mastoClient.v1.statuses.$select(statusId).update({
                status,
                spoilerText,
                sensitive,
                mediaIds,
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["home-timeline"] });
            queryClient.invalidateQueries({ queryKey: ["user-posts"] });
            queryClient.invalidateQueries({ queryKey: ["status", data.id] });
            queryClient.invalidateQueries({ queryKey: ["status-context"] });
        },
    });
}
