"use client"

import { Avatar } from "@/components/ui/avatar"
import { PostCard } from "@/components/ui/post-card"
import { useUserPosts } from "@/hooks/use-user-posts.hook"
import { useUserProfileInfo } from "@/hooks/use-user-profile-info.hook"
import { cn } from "@/utils/cn"
import { format } from "date-fns"
import { ArrowLeft, Calendar, Link as LinkIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ProfilePage() {
    const router = useRouter()
    const { data: profile, isLoading: profileLoading } = useUserProfileInfo()
    const { data: posts, isLoading: postsLoading } = useUserPosts()
    const [activeTab, setActiveTab] = useState("posts")

    if (profileLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-gray-500">
                <p className="text-xl font-bold">Profile not found</p>
                <button onClick={() => router.back()} className="mt-4 text-blue-500 hover:underline">
                    Go back
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800 px-4 py-3 flex items-center gap-6">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-900 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-xl font-bold leading-5">{profile.displayName}</h1>
                    <p className="text-xs text-gray-500">{profile.statusesCount} posts</p>
                </div>
            </div>

            {/* Banner */}
            <div className="h-48 bg-gray-800 relative">
                {profile.header ? (
                    <img
                        src={profile.header}
                        alt="Header"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-700" />
                )}
            </div>

            {/* Profile Info */}
            <div className="px-4 relative">
                <div className="flex justify-between items-start">
                    <div className="-mt-16 mb-3">
                        <div className="p-1 bg-black rounded-full inline-block">
                            <Avatar
                                src={profile.avatar}
                                fallback={profile.displayName}
                                className="w-32 h-32 border-4 border-black"
                            />
                        </div>
                    </div>
                    <button className="mt-3 px-4 py-1.5 border border-gray-600 rounded-full font-bold hover:bg-gray-900 transition-colors">
                        Edit profile
                    </button>
                </div>

                <div className="space-y-3 mb-4">
                    <div>
                        <h2 className="text-xl font-bold leading-tight">{profile.displayName}</h2>
                        <p className="text-gray-500">@{profile.username}</p>
                    </div>

                    <div
                        className="text-[15px] leading-normal [&_a]:text-blue-400 [&_a]:hover:underline whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: profile.note }}
                    />

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-500 text-sm">
                        {/* Location placeholder if available in future */}
                        {/* <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>San Francisco, CA</span>
                        </div> */}

                        {profile.url && (
                            <div className="flex items-center gap-1">
                                <LinkIcon className="w-4 h-4" />
                                <a
                                    href={profile.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline"
                                >
                                    {profile.url.replace(/^https?:\/\//, '')}
                                </a>
                            </div>
                        )}

                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Joined {format(new Date(profile.createdAt), 'MMMM yyyy')}</span>
                        </div>
                    </div>

                    <div className="flex gap-4 text-sm">
                        <button className="hover:underline">
                            <span className="font-bold text-white">{profile.followingCount}</span>{" "}
                            <span className="text-gray-500">Following</span>
                        </button>
                        <button className="hover:underline">
                            <span className="font-bold text-white">{profile.followersCount}</span>{" "}
                            <span className="text-gray-500">Followers</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-800 mt-2">
                {["Posts", "Replies", "Highlights", "Media", "Likes"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className="flex-1 hover:bg-gray-900/50 transition-colors relative py-4"
                    >
                        <span className={cn(
                            "text-sm font-medium relative pb-4",
                            activeTab === tab.toLowerCase() ? "text-white font-bold" : "text-gray-500"
                        )}>
                            {tab}
                            {activeTab === tab.toLowerCase() && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full" />
                            )}
                        </span>
                    </button>
                ))}
            </div>

            {/* Feed */}
            <div>
                {postsLoading ? (
                    <div className="p-8 flex justify-center">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : activeTab === "posts" ? (
                    posts?.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        <p className="font-bold text-lg">Nothing to see here yet</p>
                        <p>Check back later!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
