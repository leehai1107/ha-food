"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface NavLinkProps {
    href: string
    children: React.ReactNode
    subItems?: { href: string; label: string }[]
}

export function NavLink({ href, children, subItems }: NavLinkProps) {
    const pathname = usePathname()
    const isActive = pathname === href
    const [isHovered, setIsHovered] = useState(false)

    return (
        <li
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link
                href={href}
                className={cn(
                    "flex items-center gap-1 transition-colors hover:text-secondary hover:bg-secondary/10 px-4 py-2 rounded-md",
                    isActive
                        ? "text-secondary font-semibold bg-secondary/10"
                        : "text-primary-white font-semibold"
                )}
            >
                {children}
                {subItems && (
                    <ChevronDown
                        size={16}
                        className={cn(
                            "transition-transform",
                            isHovered && "rotate-180"
                        )}
                    />
                )}
            </Link>
            {subItems && isHovered && (
                <ul className="absolute left-0 w-48 bg-primary rounded-md shadow-lg py-1 z-50">
                    {subItems.map((item, index) => (
                        <li key={index}>
                            <Link
                                href={item.href}
                                className="block px-4 py-2 text-primary-white hover:bg-secondary/10 hover:text-secondary"
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    )
}
