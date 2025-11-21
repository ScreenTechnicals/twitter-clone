import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StatusVisibility } from "masto/mastodon/entities/v1/status.js";
import { useMastoClient } from "../use-masto-client.hook";

type PostStatusParams = {
    status: string;
    files?: File[]; // optional images/videos
    sensitive?: boolean;
    spoilerText?: string;
    inReplyToId?: string;
};

export function usePostStatus(visibility: StatusVisibility = "public") {
    const mastoClient = useMastoClient();
    const queryClient = useQueryClient();

    const waitForMediaReady = async (mediaId: string) => {
        if (!mastoClient) throw new Error("Masto client not initialized");
        let media = await mastoClient.v1.media.$select(mediaId).fetch();

        // Some servers take time to process videos
        while (!media.url) {
            await new Promise((r) => setTimeout(r, 1500)); // wait 1.5s
            media = await mastoClient.v1.media.$select(mediaId).fetch();
        }

        return media;
    };

    return useMutation({
        mutationFn: async ({ status, files, sensitive, spoilerText, inReplyToId }: PostStatusParams) => {
            if (!mastoClient) throw new Error("Masto client not initialized");

            let mediaIds: string[] = [];

            // ✅ 1️⃣ Upload media (images or videos)
            if (files?.length) {
                const uploads = await Promise.all(
                    files.map(async (file) => {
                        // Optional: pre-validate file size (e.g. 40MB max)
                        if (file.size > 40 * 1024 * 1024) {
                            throw new Error(`File ${file.name} is too large (max 40MB)`);
                        }

                        // Upload to Mastodon
                        const uploaded = await mastoClient.v2.media.create({
                            file,
                            description: file.name, // Optional alt text
                        });

                        // Wait for processing
                        const ready = await waitForMediaReady(uploaded.id);
                        return ready.id;
                    })
                );

                mediaIds = uploads;
            }

            // ✅ 2️⃣ Post the status with optional media
            const newStatus = await mastoClient.v1.statuses.create({
                status,
                mediaIds: mediaIds.length ? mediaIds : undefined,
                sensitive: sensitive ?? false,
                spoilerText: spoilerText ?? undefined,
                visibility,
                inReplyToId,
            });

            return newStatus;
        },

        // ✅ 3️⃣ On success → revalidate queries
        onSuccess: (newStatus, variables) => {
            // Optimistic update for reply count
            if (variables.inReplyToId) {
                // We don't have the initial count here easily, but we can increment whatever is in the store
                // or just rely on the invalidation if we don't want to pass initial count everywhere.
                // For now, let's just invalidate.
                // Actually, let's try to update the cache for immediate feedback.

                queryClient.setQueryData(["status-context", variables.inReplyToId], (oldData: any) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        descendants: [...oldData.descendants, newStatus]
                    };
                });
            }

            queryClient.invalidateQueries({ queryKey: ["user-posts"] });
            queryClient.invalidateQueries({ queryKey: ["home-timeline"] });
            if (variables.inReplyToId) {
                queryClient.invalidateQueries({ queryKey: ["status", variables.inReplyToId] });
                queryClient.invalidateQueries({ queryKey: ["status-context", variables.inReplyToId] });
            }
        },
    });
}
