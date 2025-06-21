"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  subItems?: {
    href: string;
    label: string;
    subItems?: { href: string; label: string }[];
  }[];
  width?: string;
  isMobile?: boolean;
  level?: number;
  onClick?: () => void;
}

function NavSubItem({
  href,
  label,
  subItems,
  level = 0,
  onClick,
}: {
  href: string;
  label: string;
  subItems?: {
    href: string;
    label: string;
    subItems?: { href: string; label: string }[];
  }[];
  level?: number;
  onClick?: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <Link
          href={href}
          className="flex-1 px-4 py-2 text-primary hover:text-secondary"
          onClick={onClick}
        >
          {label}
        </Link>
        {subItems && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <ChevronRight
              size={16}
              className={cn("transition-transform", isExpanded && "rotate-90")}
            />
          </button>
        )}
      </div>
      {subItems && isExpanded && (
        <div
          className={cn(
            "w-full bg-white",
            level > 0 && "pl-4 border-l border-gray-200"
          )}
        >
          {subItems.map((item, index) => (
            <NavSubItem
              key={index}
              href={item.href}
              label={item.label}
              subItems={item.subItems}
              level={level + 1}
              onClick={onClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function NavLink({
  href,
  children,
  subItems,
  width,
  isMobile = false,
  level = 0,
  onClick,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const renderSubItems = (items: NavLinkProps["subItems"]) => {
    if (!items) return null;

    if (isMobile) {
      return (
        <div
          className={cn(
            "w-full bg-white",
            level > 0 && "pl-4 border-l border-gray-200"
          )}
        >
          {items.map((item, index) => (
            <NavSubItem
              key={index}
              href={item.href}
              label={item.label}
              subItems={item.subItems}
              level={level + 1}
              onClick={onClick}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        className={`absolute left-0 w-${width} bg-primary rounded-md shadow-lg py-1 z-50 animate-float-in-top`}
      >
        {items.map((item, index) => (
          <div key={index} className="relative group">
            <Link
              href={item.href}
              className="flex items-center justify-between px-4 py-2 text-primary-white hover:bg-secondary/10 hover:text-secondary"
            >
              {item.label}
              {item.subItems && <ChevronRight size={16} className="ml-2" />}
            </Link>
            {item.subItems && (
              <div className="hidden group-hover:block absolute left-full top-0 w-56 bg-primary rounded-md shadow-lg py-1 z-50">
                {item.subItems.map((subItem, subIndex) => (
                  <div key={subIndex}>
                    <Link
                      href={subItem.href}
                      className="block px-4 py-2 text-primary-white hover:bg-secondary/10 hover:text-secondary"
                    >
                      {subItem.label}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <li
      className={cn("relative", isMobile && "w-full")}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <Link
          href={href}
          className={cn(
            "flex-1 flex items-center gap-1 transition-colors hover:text-dark-red hover:bg-secondary/10 px-4 py-2 rounded-md",
            isActive
              ? "text-primary font-semibold bg-secondary/10"
              : "text-primary font-semibold",
            isMobile && "w-full"
          )}
          onClick={onClick}
        >
          {children}
        </Link>
        {subItems && isMobile && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <ChevronRight
              size={16}
              className={cn("transition-transform", isExpanded && "rotate-90")}
            />
          </button>
        )}
        {subItems && !isMobile && (
          <ChevronDown
            size={16}
            className={cn("transition-transform", isHovered && "rotate-180")}
          />
        )}
      </div>
      {subItems &&
        ((isMobile && isExpanded) || (!isMobile && isHovered)) &&
        renderSubItems(subItems)}
    </li>
  );
}
