"use client"

import { Avatar } from "@/components/ui/avatar"
import { useDeleteStatus } from "@/hooks/mutations/use-delete-status.hook"
import { useEditStatus } from "@/hooks/mutations/use-edit-status.hook"
import { useFavouriteStatus } from "@/hooks/mutations/use-favourite-status.hook"
import { useReblogStatus } from "@/hooks/mutations/use-reblog-status.hook"
import { useUserSession } from "@/hooks/use-user-session.hook"
import { useInteractionStore } from "@/store/interaction.store"
import { cn } from "@/utils/cn"
import { formatDistanceToNow } from "date-fns"
import { Edit2, Heart, MessageCircle, MoreHorizontal, Repeat2, Share, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

interface PostCardProps {
    post: any
}

export function PostCard({ post }: PostCardProps) {
    const router = useRouter()
    const { mutateAsync: favourite } = useFavouriteStatus()
    const { mutateAsync: reblog } = useReblogStatus()
    const { mutateAsync: deleteStatus } = useDeleteStatus()
    const { token, username } = useUserSession() // Assuming username is available to check ownership
    // We need to check if the post belongs to the user. 
    // The post object usually has account.id. We need current user's id.
    // useUserSession returns session info. Let's assume we can match username or id.
    // Actually, Mastodon post.account.id is what we need. 
    // Does useUserSession give us the ID? Let's check. 
    // If not, we might need to fetch 'verify_credentials' or store it.
    // For now, let's assume we can match by username if ID isn't available, or just show it for now.
    // Wait, useUserSession returns `username`. post.account.username is available.

    const isOwner = post.account.username === username

    const [showMenu, setShowMenu] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const {
        likedPosts,
        repostedPosts,
        likeCounts,
        repostCounts,
        replyCounts,
        toggleLike,
        toggleRepost
    } = useInteractionStore()

    const isLiked = likedPosts[post.id] ?? post.favourited
    const isReposted = repostedPosts[post.id] ?? post.reblogged
    const likesCount = likeCounts[post.id] ?? post.favouritesCount
    const repostsCount = repostCounts[post.id] ?? post.reblogsCount
    const repliesCount = replyCounts[post.id] ?? post.repliesCount

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowMenu(false)
        if (confirm("Are you sure you want to delete this post?")) {
            try {
                await deleteStatus(post.id)
                toast.success("Post deleted")
            } catch (error) {
                toast.error("Failed to delete post")
            }
        }
    }

    const { mutateAsync: editStatus, isPending: isEditingPost } = useEditStatus()
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState("")

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowMenu(false)
        // Strip HTML tags for editing
        const plainText = post.content.replace(/<[^>]*>/g, '')
        setEditContent(plainText)
        setIsEditing(true)
    }

    const handleSaveEdit = async () => {
        if (!editContent.trim()) return

        try {
            await editStatus({
                statusId: post.id,
                status: editContent
            })
            setIsEditing(false)
            toast.success("Post updated")
        } catch (error) {
            toast.error("Failed to update post")
        }
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        setEditContent("")
    }

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation()
        toggleLike(post.id, post.favouritesCount, post.favourited)

        try {
            await favourite(post.id)
        } catch (error) {
            // Revert on failure
            toggleLike(post.id, post.favouritesCount, post.favourited)
            toast.error("Failed to like")
        }
    }

    const handleRepost = async (e: React.MouseEvent) => {
        e.stopPropagation()
        toggleRepost(post.id, post.reblogsCount, post.reblogged)

        try {
            await reblog(post.id)
        } catch (error) {
            // Revert on failure
            toggleRepost(post.id, post.reblogsCount, post.reblogged)
            toast.error("Failed to repost")
        }
    }

    return (
        <article
            onClick={() => !isEditing && router.push(`/status/${post.id}`)}
            className="border-b border-gray-800 p-4 hover:bg-gray-900/30 transition-colors cursor-pointer relative"
        >
            <div className="flex gap-3">
                <Avatar src={post.account.avatar} fallback={post.account.displayName} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <span className="font-bold truncate hover:underline">
                                {post.account.displayName}
                            </span>
                            <span className="text-gray-500 truncate">
                                @{post.account.username}
                            </span>
                            <span className="text-gray-500">·</span>
                            <span className="text-gray-500 text-sm hover:underline">
                                {(() => {
                                    const date = new Date(post.created_at);
                                    return isNaN(date.getTime())
                                        ? 'Just now'
                                        : formatDistanceToNow(date, { addSuffix: true });
                                })()}
                            </span>
                        </div>

                        {!isEditing && (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setShowMenu(!showMenu)
                                    }}
                                    className="p-2 hover:bg-blue-500/10 rounded-full group transition-colors"
                                >
                                    <MoreHorizontal className="w-5 h-5 text-gray-500 group-hover:text-blue-500" />
                                </button>

                                {showMenu && isOwner && (
                                    <div className="absolute right-0 top-full mt-1 w-32 bg-black border border-gray-800 rounded-lg shadow-lg z-50 overflow-hidden">
                                        <button
                                            onClick={handleEdit}
                                            className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-900 text-left text-sm transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-900 text-left text-sm text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>


                    {isEditing ? (
                        <div className="mt-2" onClick={e => e.stopPropagation()}>
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 resize-none min-h-[100px]"
                                autoFocus
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    onClick={handleCancelEdit}
                                    className="px-4 py-1.5 text-sm font-bold text-white hover:bg-gray-900 rounded-full transition-colors"
                                    disabled={isEditingPost}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-4 py-1.5 text-sm font-bold bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50"
                                    disabled={!editContent.trim() || isEditingPost}
                                >
                                    {isEditingPost ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="mt-1 text-[15px] leading-normal break-words [&_a]:text-blue-400 [&_a]:hover:underline"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    )}

                    {post.mediaAttachments?.length > 0 && (
                        <div className={cn(
                            "mt-3 grid gap-2 rounded-2xl overflow-hidden border border-gray-800",
                            post.mediaAttachments.length > 1 ? "grid-cols-2" : "grid-cols-1"
                        )}>
                            {post.mediaAttachments.map((media: any) => (
                                <div key={media.id} className="relative aspect-video bg-gray-900">
                                    {media.type === 'image' ? (
                                        <img
                                            src={media.url}
                                            alt={media.description || "Post attachment"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <video
                                            src={media.url}
                                            controls
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-3 max-w-md">
                        <button className="group flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                                <MessageCircle className="w-4 h-4" />
                            </div>
                            <span className="text-xs">{repliesCount}</span>
                        </button>

                        <button
                            onClick={handleRepost}
                            className={cn(
                                "group flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors",
                                isReposted && "text-green-500"
                            )}
                        >
                            <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                                <Repeat2 className="w-4 h-4" />
                            </div>
                            <span className="text-xs">{repostsCount}</span>
                        </button>

                        <button
                            onClick={handleLike}
                            className={cn(
                                "group flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-colors",
                                isLiked && "text-pink-500"
                            )}
                        >
                            <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
                                <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                            </div>
                            <span className="text-xs">{likesCount}</span>
                        </button>

                        <button className="group flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                                <Share className="w-4 h-4" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    )
}
