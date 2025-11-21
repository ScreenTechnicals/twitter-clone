"use client"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useUserSession } from "@/hooks/use-user-session.hook"
import { cn } from "@/utils/cn"
import { Bell, Bookmark, Home, Mail, MoreHorizontal, PenSquare, Search, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarItems = [
    { icon: Home, label: "Home", href: "/home" },
    { icon: Search, label: "Explore", href: "/explore" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: Mail, label: "Messages", href: "/messages" },
    { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
    { icon: User, label: "Profile", href: "/profile" },
]

export function Sidebar() {
    const pathname = usePathname()
    const { name, username, image } = useUserSession()

    return (
        <aside className="sticky top-0 h-screen w-[80px] xl:w-[275px] flex flex-col justify-between px-2 xl:px-4 py-4 overflow-y-auto shrink-0">
            <div className="flex flex-col gap-4">
                <Link href="/home" className="p-3 w-fit rounded-full hover:bg-blue-900/20 transition-colors">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-xl">M</span>
                    </div>
                </Link>

                <nav className="flex flex-col gap-2">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 p-3 rounded-full transition-colors hover:bg-gray-900 max-xl:justify-center",
                                    isActive && "font-bold"
                                )}
                            >
                                <item.icon className={cn("w-7 h-7", isActive ? "fill-current" : "")} />
                                <span className="text-xl max-xl:hidden">{item.label}</span>
                            </Link>
                        )
                    })}
                    <button className="flex items-center gap-4 p-3 rounded-full transition-colors hover:bg-gray-900 max-xl:justify-center">
                        <MoreHorizontal className="w-7 h-7" />
                        <span className="text-xl max-xl:hidden">More</span>
                    </button>
                </nav>

                <Button className="w-full h-14 text-lg font-bold rounded-full mt-4 max-xl:w-14 max-xl:h-14 max-xl:p-0">
                    <span className="max-xl:hidden">Post</span>
                    <PenSquare className="hidden max-xl:block w-6 h-6" />
                </Button>
            </div>

            <div className="mb-4">
                <button className="flex items-center gap-3 w-full p-3 rounded-full hover:bg-gray-900 transition-colors max-xl:justify-center">
                    <Avatar src={image || ""} fallback={name || "U"} />
                    <div className="flex flex-col items-start max-xl:hidden">
                        <span className="font-bold text-sm line-clamp-1">{name}</span>
                        <span className="text-gray-500 text-sm line-clamp-1">@{username}</span>
                    </div>
                    <MoreHorizontal className="w-5 h-5 ml-auto text-gray-500 max-xl:hidden" />
                </button>
            </div>
        </aside>
    )
}
