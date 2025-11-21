"use client"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { usePostStatus } from "@/hooks/mutations/use-post-status.hook"
import { useUserSession } from "@/hooks/use-user-session.hook"
import { Calendar, Globe, Image, MapPin, Smile } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { useInteractionStore } from "@/store/interaction.store"

interface ComposePostProps {
    replyToId?: string
    initialReplyCount?: number
    placeholder?: string
}

export function ComposePost({ replyToId, initialReplyCount = 0, placeholder = "What is happening?!" }: ComposePostProps) {
    const { image, name } = useUserSession()
    const { mutateAsync: postStatus, isPending } = usePostStatus()
    const { incrementReplyCount } = useInteractionStore()
    const [status, setStatus] = useState("")

    const handlePost = async () => {
        if (!status.trim()) return

        try {
            await postStatus({ status, inReplyToId: replyToId })
            if (replyToId) {
                incrementReplyCount(replyToId, initialReplyCount)
            }
            setStatus("")
            toast.success(replyToId ? "Reply sent!" : "Post sent!")
        } catch (error) {
            toast.error("Failed to post")
        }
    }

    return (
        <div className="border-b border-gray-800 p-4">
            <div className="flex gap-3">
                <Avatar src={image || ""} fallback={name || "U"} />
                <div className="flex-1">
                    <textarea
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-transparent text-xl placeholder-gray-500 focus:outline-none resize-none min-h-[120px]"
                    />
                    {status && (
                        <div className="flex items-center gap-2 text-blue-500 font-bold text-sm mb-3 pb-3 border-b border-gray-800">
                            <Globe className="w-4 h-4" />
                            <span>Everyone can reply</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-0 text-blue-500">
                            <button className="p-2 rounded-full hover:bg-blue-500/10 transition-colors">
                                <Image className="w-5 h-5" />
                            </button>
                            <button className="p-2 rounded-full hover:bg-blue-500/10 transition-colors">
                                <div className="border border-current rounded px-1 text-[10px] font-bold">GIF</div>
                            </button>
                            <button className="p-2 rounded-full hover:bg-blue-500/10 transition-colors">
                                <Smile className="w-5 h-5" />
                            </button>
                            <button className="p-2 rounded-full hover:bg-blue-500/10 transition-colors">
                                <Calendar className="w-5 h-5" />
                            </button>
                            <button className="p-2 rounded-full hover:bg-blue-500/10 transition-colors">
                                <MapPin className="w-5 h-5" />
                            </button>
                        </div>
                        <Button
                            onClick={handlePost}
                            disabled={!status.trim() || isPending}
                            className="font-bold px-6"
                        >
                            {isPending ? "Posting..." : replyToId ? "Reply" : "Post"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
