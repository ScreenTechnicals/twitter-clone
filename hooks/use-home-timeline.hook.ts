import { useInfiniteQuery } from "@tanstack/react-query";
import { useMastoClient } from "./use-masto-client.hook";
import { useUserSession } from "./use-user-session.hook";

export function useHomeTimeline(limit = 20) {
    const mastoClient = useMastoClient();
    const { isAuthenticated } = useUserSession();

    return useInfiniteQuery({
        queryKey: ["home-timeline", limit],
        queryFn: async ({ pageParam }) => {
            if (!mastoClient) throw new Error("Masto client not initialized");
            return mastoClient.v1.timelines.home.list({
                limit,
                maxId: pageParam as string | undefined
            });
        },
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => {
            if (lastPage.length < limit) return undefined;
            return lastPage[lastPage.length - 1].id;
        },
        enabled: !!mastoClient && isAuthenticated,
        staleTime: 1000 * 60 * 1,
    });
}
