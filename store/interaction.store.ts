import { create } from 'zustand'

interface InteractionState {
    likedPosts: Record<string, boolean>
    repostedPosts: Record<string, boolean>
    likeCounts: Record<string, number>
    repostCounts: Record<string, number>
    replyCounts: Record<string, number>

    toggleLike: (postId: string, initialCount: number, currentlyLiked: boolean) => void
    toggleRepost: (postId: string, initialCount: number, currentlyReposted: boolean) => void
    incrementReplyCount: (postId: string, initialCount: number) => void
}

export const useInteractionStore = create<InteractionState>((set) => ({
    likedPosts: {},
    repostedPosts: {},
    likeCounts: {},
    repostCounts: {},
    replyCounts: {},

    toggleLike: (postId, initialCount, currentlyLiked) =>
        set((state) => {
            const isLiked = state.likedPosts[postId] ?? currentlyLiked
            const currentCount = state.likeCounts[postId] ?? initialCount

            return {
                likedPosts: { ...state.likedPosts, [postId]: !isLiked },
                likeCounts: { ...state.likeCounts, [postId]: isLiked ? currentCount - 1 : currentCount + 1 }
            }
        }),

    toggleRepost: (postId, initialCount, currentlyReposted) =>
        set((state) => {
            const isReposted = state.repostedPosts[postId] ?? currentlyReposted
            const currentCount = state.repostCounts[postId] ?? initialCount

            return {
                repostedPosts: { ...state.repostedPosts, [postId]: !isReposted },
                repostCounts: { ...state.repostCounts, [postId]: isReposted ? currentCount - 1 : currentCount + 1 }
            }
        }),

    incrementReplyCount: (postId, initialCount) =>
        set((state) => {
            const currentCount = state.replyCounts[postId] ?? initialCount
            return {
                replyCounts: { ...state.replyCounts, [postId]: currentCount + 1 }
            }
        })
}))
