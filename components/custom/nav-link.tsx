"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavLinkProps {
    href: string
    children: React.ReactNode
}

export function NavLink({ href, children }: NavLinkProps) {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
        <Link
            href={href}
            className={cn(
                "transition-colors hover:text-primary",
                isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
            )}
        >
            {children}
        </Link>
    )
}
