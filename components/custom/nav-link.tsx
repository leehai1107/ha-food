"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

interface NavLinkProps {
    href: string
    children: React.ReactNode
    subItems?: { href: string; label: string; subItems?: { href: string; label: string }[] }[]
    width?: string
}

export function NavLink({ href, children, subItems, width }: NavLinkProps) {
    const pathname = usePathname()
    const isActive = pathname === href
    const [isHovered, setIsHovered] = useState(false)

    const renderSubItems = (items: NavLinkProps['subItems']) => {
        if (!items) return null;
        return (
            <ul className={`absolute left-0 w-${width} bg-primary rounded-md shadow-lg py-1 z-50 animate-float-in-top`}>
                {items.map((item, index) => (
                    <li key={index} className="relative group">
                        <Link
                            href={item.href}
                            className="flex items-center justify-between px-4 py-2 text-primary-white hover:bg-secondary/10 hover:text-secondary"
                        >
                            {item.label}
                            {item.subItems && (
                                <ChevronRight size={16} className="ml-2" />
                            )}
                        </Link>
                        {item.subItems && (
                            <ul className="hidden group-hover:block absolute left-full top-0 w-56 bg-primary rounded-md shadow-lg py-1 z-50">
                                {item.subItems.map((subItem, subIndex) => (
                                    <li key={subIndex}>
                                        <Link
                                            href={subItem.href}
                                            className="block px-4 py-2 text-primary-white hover:bg-secondary/10 hover:text-secondary"
                                        >
                                            {subItem.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <li
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link
                href={href}
                className={cn(
                    "flex items-center gap-1 transition-colors hover:text-dark-red hover:bg-secondary/10 px-4 py-2 rounded-md",
                    isActive
                        ? "text-primary font-semibold bg-secondary/10" // Active link style
                        : "text-primary font-semibold"
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
            {subItems && isHovered && renderSubItems(subItems)}
        </li>
    )
}
