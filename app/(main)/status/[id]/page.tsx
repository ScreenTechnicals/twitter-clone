"use client"

import { ComposePost } from "@/components/ui/compose-post"
import { PostCard } from "@/components/ui/post-card"
import { useStatusContext } from "@/hooks/use-status-context.hook"
import { useStatus } from "@/hooks/use-status.hook"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { use } from "react"

export default function StatusPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const { data: status, isLoading: isStatusLoading } = useStatus(id)
    const { data: context, isLoading: isContextLoading } = useStatusContext(id)

    if (isStatusLoading) {
        return (
            <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!status) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-gray-500">
                <p className="text-lg font-bold">Post not found</p>
                <button onClick={() => router.back()} className="text-blue-500 hover:underline mt-2">
                    Go back
                </button>
            </div>
        )
    }

    return (
        <>
            <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800 px-4 py-3 flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-900 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold">Post</h1>
            </header>

            <div className="pb-20">
                {/* Ancestors */}
                {context?.ancestors.map((post: any) => (
                    <PostCard key={post.id} post={post} />
                ))}

                {/* Main Post */}
                <div className="border-b border-gray-800">
                    <PostCard post={status} />
                </div>

                {/* Reply Input */}
                <div className="border-b border-gray-800">
                    <ComposePost
                        replyToId={status.id}
                        initialReplyCount={status.repliesCount}
                        placeholder="Post your reply"
                    />
                </div>

                {/* Descendants */}
                {isContextLoading ? (
                    <div className="flex justify-center p-8">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    context?.descendants.map((post: any) => (
                        <PostCard key={post.id} post={post} />
                    ))
                )}
            </div>
        </>
    )
}
