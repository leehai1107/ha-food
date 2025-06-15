"use client";
import { useState, useEffect } from "react";
import { NavLink } from "@/components/custom/nav-link";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import authService from "@/services/authService";
import categoryService from "@/services/categoryService";
import type { Category } from "@/types";

interface SubItem {
    href: string;
    label: string;
    subItems?: SubItem[];
}

export default function RootHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const router = useRouter();
    const { getCartItemCount } = useCart()
    const { account, isAuthenticated } = useAuth()

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getHierarchicalCategories();
                if (response.success) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const transformCategoriesToSubItems = (categories: Category[]): SubItem[] => {
        return categories.map(category => ({
            href: `/products/${category.id}`,
            label: category.name,
            subItems: category.children && category.children.length > 0 
                ? transformCategoriesToSubItems(category.children)
                : undefined
        }));
    };

    return (
        <>
            {/* Header Section */}
            <header className="w-full bg-primary animate-float-in-top z-30 sticky top-0 left-0 right-0 shadow-lg">
                <div className="max-w-[1200px] mx-auto py-6 w-[calc(100%-20px)] text-secondary flex justify-between items-center">
                    <Button>
                        <Link href="/">
                            <Image
                                src="/logo/logo-primary.png"
                                alt="Logo"
                                width={168}
                                height={47}
                            />
                        </Link>
                    </Button>

                    {/* Header Controls: Always Visible */}
                    <div className="flex items-center gap-2">
                        {/* Search & Cart Icons */}
                        <button>
                            <Search size={26} />
                        </button>
                        <button
                            className="relative p-2"
                            onClick={
                                () => router.push("/cart")
                            }>
                            <ShoppingCart size={26} />
                            {getCartItemCount() > 0 && (
                                <span className="absolute -top-0 -right-0 bg-secondary text-primary-black text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                                    {getCartItemCount()}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle Mobile Menu"
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center justify-center gap-4 text-primary-white bg-primary-white py-1 font-semibold">
                    <nav>
                        <ul className="flex items-center gap-4 list-none flex-wrap">
                            <NavLink href="/">TRANG CHỦ</NavLink>
                            <NavLink href="/about">GIỚI THIỆU</NavLink>
                            <NavLink
                                href="/products"
                                subItems={transformCategoriesToSubItems(categories)}
                                width="56"
                            >
                                SẢN PHẨM
                            </NavLink>
                            <NavLink href="/news">TIN TỨC</NavLink>
                            <NavLink href="/contact">LIÊN HỆ</NavLink>
                            <NavLink
                                href="/legal"
                                subItems={[
                                    { href: "/legal", label: "Chính sách bảo mật" },
                                    { href: "/legal", label: "Chính sách thanh toán" },
                                    { href: "/legal", label: "Chính sách vận chuyển" },
                                    { href: "/legal", label: "Chính sách đổi trả" },
                                    { href: "/legal", label: "Chính sách chiết khấu" },
                                ]}
                                width="64"
                            >
                                CHÍNH SÁCH
                            </NavLink>
                            {isAuthenticated && authService.isAdmin(account) && (
                                <NavLink href="/admin">🛠️ Quản trị</NavLink>
                            )}
                        </ul>
                    </nav>
                </div>

                {/* Mobile Menu Toggle & Tooltip Container */}
                <div className="relative md:hidden">
                    {/* Tooltip-like Menu */}
                    {isMobileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-float-in-top">
                            <nav>
                                <ul className="flex flex-col gap-2 p-3 text-sm text-primary font-medium">
                                    <NavLink href="/">TRANG CHỦ</NavLink>
                                    <NavLink href="/about">GIỚI THIỆU</NavLink>
                                    <NavLink href="/products">SẢN PHẨM</NavLink>
                                    <NavLink href="/news">TIN TỨC</NavLink>
                                    <NavLink href="/contact">LIÊN HỆ</NavLink>
                                    <NavLink href="/legal">CHÍNH SÁCH</NavLink>
                                </ul>
                            </nav>
                        </div>
                    )}
                </div>

            </header>
        </>
    );
}
