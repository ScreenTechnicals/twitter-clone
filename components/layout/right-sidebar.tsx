"use client"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useTrendingTags } from "@/hooks/use-trending-tags.hook"
import { useWhoToFollow } from "@/hooks/use-who-to-follow.hook"
import { Search } from "lucide-react"

export function RightSidebar() {
    const { data: trendingTags } = useTrendingTags()
    const { data: suggestions } = useWhoToFollow()

    return (
        <aside className="sticky top-0 h-screen w-[350px] px-8 py-4 hidden lg:flex flex-col gap-6 overflow-y-auto shrink-0">
            <div className="sticky top-0 bg-black pb-2 z-10">
                <div className="relative group">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-blue-500" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full bg-gray-900 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-transparent focus:bg-black"
                    />
                </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-4">
                <h2 className="text-xl font-bold mb-4 px-2">Trends for you</h2>
                <div className="flex flex-col">
                    {trendingTags?.slice(0, 5).map((tag: any) => (
                        <div key={tag.name} className="py-3 px-2 hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors">
                            <p className="text-gray-500 text-xs">Trending</p>
                            <p className="font-bold">#{tag.name}</p>
                            <p className="text-gray-500 text-xs">{tag.history[0]?.accounts} people talking</p>
                        </div>
                    ))}
                    {!trendingTags?.length && <p className="text-gray-500 px-2">No trends available</p>}
                </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-4">
                <h2 className="text-xl font-bold mb-4 px-2">Who to follow</h2>
                <div className="flex flex-col gap-4">
                    {suggestions?.slice(0, 3).map((user: any) => (
                        <div key={user.id} className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3 min-w-0">
                                <Avatar src={user.avatar} fallback={user.displayName} />
                                <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-sm truncate hover:underline cursor-pointer">{user.displayName}</span>
                                    <span className="text-gray-500 text-sm truncate">@{user.acct}</span>
                                </div>
                            </div>
                            <Button variant="secondary" size="sm" className="rounded-full font-bold h-8">
                                Follow
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    )
}
