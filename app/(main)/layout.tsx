import { RightSidebar } from "@/components/layout/right-sidebar"
import { Sidebar } from "@/components/layout/sidebar"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <div className="container mx-auto max-w-[1265px]">
                <div className="flex min-h-screen justify-center">
                    <Sidebar />
                    <main className="flex-1 border-x border-gray-800 max-w-[600px] w-full min-h-screen">
                        {children}
                    </main>
                    <RightSidebar />
                </div>
            </div>
        </div>
    )
}
