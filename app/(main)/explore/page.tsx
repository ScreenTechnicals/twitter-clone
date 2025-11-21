"use client"

import { useTrendingTags } from "@/hooks/use-trending-tags.hook"
import { cn } from "@/utils/cn"
import { Search, Settings } from "lucide-react"
import { useState } from "react"

const TABS = ["For you", "Trending", "News", "Sports", "Entertainment"]

export default function ExplorePage() {
    const [activeTab, setActiveTab] = useState("For you")
    const { data: trendingTags, isLoading } = useTrendingTags()

    return (
        <>
            <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800">
                <div className="px-4 py-3 flex items-center gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-2.5 w-4 h-4 text-gray-500 group-focus-within:text-blue-500" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full bg-gray-900 rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-transparent focus:bg-black text-sm"
                        />
                    </div>
                    <Settings className="w-5 h-5" />
                </div>

                <div className="flex overflow-x-auto no-scrollbar border-b border-gray-800">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "flex-1 min-w-fit px-4 py-3 text-sm font-medium hover:bg-gray-900/50 transition-colors relative",
                                activeTab === tab ? "text-white font-bold" : "text-gray-500"
                            )}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </header>

            <div className="pb-20">
                {activeTab === "For you" || activeTab === "Trending" ? (
                    <div className="flex flex-col">
                        {isLoading ? (
                            <div className="flex justify-center p-8">
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : (
                            trendingTags?.map((tag: any) => (
                                <div key={tag.name} className="py-4 px-4 hover:bg-gray-900/30 transition-colors cursor-pointer border-b border-gray-800">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-500 text-xs mb-0.5">Trending in Technology</p>
                                            <p className="font-bold text-base">#{tag.name}</p>
                                            <p className="text-gray-500 text-xs mt-0.5">{tag.history[0]?.accounts} posts</p>
                                        </div>
                                        <button className="p-2 hover:bg-blue-500/10 rounded-full group">
                                            <Settings className="w-4 h-4 text-gray-500 group-hover:text-blue-500" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <p className="text-lg font-bold mb-2">No content available</p>
                        <p className="text-sm">This category is empty right now.</p>
                    </div>
                )}
            </div>
        </>
    )
}
