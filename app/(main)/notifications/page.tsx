"use client"

import { Avatar } from "@/components/ui/avatar"
import { useNotifications } from "@/hooks/use-notifications.hook"
import { Heart, MessageCircle, Repeat2, User } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NotificationsPage() {
    const { data: notifications, isLoading } = useNotifications()
    const router = useRouter()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-20">
            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800 px-4 py-3">
                <h1 className="text-xl font-bold">Notifications</h1>
            </div>

            <div className="divide-y divide-gray-800">
                {notifications?.map((notification) => {
                    const account = notification.account
                    const type = notification.type
                    const status = notification.status

                    return (
                        <div
                            key={notification.id}
                            onClick={() => {
                                if (status) {
                                    router.push(`/status/${status.id}`)
                                } else {
                                    router.push(`/profile/${account.id}`)
                                }
                            }}
                            className="p-4 hover:bg-gray-900/50 transition-colors cursor-pointer flex gap-4"
                        >
                            <div className="w-10 flex justify-end shrink-0">
                                {type === "favourite" && <Heart className="w-7 h-7 text-pink-500 fill-current" />}
                                {type === "reblog" && <Repeat2 className="w-7 h-7 text-green-500" />}
                                {type === "follow" && <User className="w-7 h-7 text-blue-500 fill-current" />}
                                {type === "mention" && <MessageCircle className="w-7 h-7 text-blue-400" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="mb-2">
                                    <Avatar src={account.avatar} fallback={account.displayName} className="w-8 h-8" />
                                </div>

                                <p className="text-[15px]">
                                    <span className="font-bold hover:underline">{account.displayName}</span>{" "}
                                    <span className="text-gray-500">
                                        {type === "favourite" && "liked your post"}
                                        {type === "reblog" && "reposted your post"}
                                        {type === "follow" && "followed you"}
                                        {type === "mention" && "replied to you"}
                                    </span>
                                </p>

                                {status && (
                                    <p className="text-gray-500 mt-2 line-clamp-3 text-[15px]">
                                        {status.content.replace(/<[^>]*>/g, "")}
                                    </p>
                                )}
                            </div>
                        </div>
                    )
                })}

                {notifications?.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        <p className="font-bold text-lg">No notifications yet</p>
                        <p>When someone interacts with you, you'll see it here.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
