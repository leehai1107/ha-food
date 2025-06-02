"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "./icon"

const sidebarItems = [
    {
        title: "Projects",
        href: "/admin/projects",
        icon: Icons.layout
    },
    {
        title: "Blogs",
        href: "/admin/blogs",
        icon: Icons.pencil
    }
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <div className="w-64 border-r min-h-screen p-4 space-y-4">
            <div className="px-2 py-2">
                <h2 className="text-lg font-semibold">Admin Dashboard</h2>
            </div>
            <nav className="space-y-2">
                {sidebarItems.map((item) => (
                    <Button
                        key={item.href}
                        variant="ghost"
                        className={cn(
                            "w-full justify-start gap-2",
                            pathname === item.href && "bg-muted"
                        )}
                        asChild
                    >
                        <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    </Button>
                ))}
            </nav>
        </div>
    )
} 