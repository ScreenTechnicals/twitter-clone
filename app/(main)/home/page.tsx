"use client"

import { ComposePost } from "@/components/ui/compose-post"
import { PostCard } from "@/components/ui/post-card"
import { useHomeTimeline } from "@/hooks/use-home-timeline.hook"
import { Settings } from "lucide-react"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

export default function HomePage() {
    const {
        data: timeline,
        isPending,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useHomeTimeline()
    const { ref, inView } = useInView()

    useEffect(() => {
        if (isError) {
            console.error("Timeline error:", error)
        }
    }, [isError, error])

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, fetchNextPage])

    return (
        <>
            <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800 px-4 py-3">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Home</h1>
                    <div className="flex items-center gap-4">
                        <Settings className="w-5 h-5" />
                    </div>
                </div>
                <div className="flex mt-4 border-b border-gray-800 absolute bottom-0 left-0 w-full translate-y-full bg-black/80 backdrop-blur-md hidden">
                    {/* Tab navigation if needed later */}
                </div>
            </header>

            <ComposePost />

            <div className="pb-20">
                {isPending ? (
                    <div className="flex justify-center p-8">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : isError ? (
                    <div className="flex justify-center p-8 text-red-500">
                        Failed to load timeline
                    </div>
                ) : (
                    <>
                        {timeline?.pages.flatMap((page: any) => page).filter((post: any) => {
                            const hasContent = post.content && post.content.replace(/<[^>]*>/g, '').trim().length > 0
                            const hasMedia = post.mediaAttachments && post.mediaAttachments.length > 0
                            return hasContent || hasMedia
                        }).map((post: any) => (
                            <PostCard key={post.id} post={post} />
                        ))}

                        {/* Infinite scroll trigger */}
                        <div ref={ref} className="h-10 flex items-center justify-center p-4">
                            {isFetchingNextPage && (
                                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
