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
import SearchModal from "../ui/search-modal";
import type { Category } from "@/types";

interface SubItem {
  href: string;
  label: string;
  subItems?: SubItem[];
}

export default function RootHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const router = useRouter();
  const { getCartItemCount } = useCart();
  const { account, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getHierarchicalCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Add global keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Ctrl+K (Windows/Linux) or Cmd+K (Mac) is pressed
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Helper to collect all descendant IDs (including self)
  const collectCategoryIds = (category: Category): number[] => {
    let ids = [category.id];
    if (category.children && category.children.length > 0) {
      for (const child of category.children) {
        ids = ids.concat(collectCategoryIds(child));
      }
    }
    return ids;
  };

  const transformCategoriesToSubItems = (categories: Category[]): SubItem[] => {
    return categories.map((category) => {
      const allIds = collectCategoryIds(category);
      return {
        href: `/products?categoryId=${allIds.join(",")}`,
        label: category.name,
        subItems:
          category.children && category.children.length > 0
            ? transformCategoriesToSubItems(category.children)
            : undefined,
      };
    });
  };

  const toggleSubItems = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleSearch = (searchTerm: string) => {
    // Navigate to products page with search parameter using replace to avoid history conflicts
    router.replace(`/products?search=${encodeURIComponent(searchTerm)}`);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const renderMobileSubItems = (
    subItems?: SubItem[],
    parentPath: string = ""
  ) => {
    if (!subItems) return null;

    return (
      <ul className="mt-2 space-y-2">
        {subItems.map((item, index) => {
          const itemPath = `${parentPath}-${index}`;
          const hasSubItems = item.subItems && item.subItems.length > 0;

          return (
            <li key={index}>
              <div className="flex items-center justify-between">
                <Link
                  href={item.href}
                  className="block py-1 hover:text-primary-dark"
                >
                  {item.label}
                </Link>
                {hasSubItems && (
                  <button
                    onClick={() => toggleSubItems(itemPath)}
                    className="p-1"
                  >
                    {expandedItems.includes(itemPath) ? "-" : "+"}
                  </button>
                )}
              </div>
              {hasSubItems &&
                expandedItems.includes(itemPath) &&
                renderMobileSubItems(item.subItems, itemPath)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <>
      {/* Header Section */}
      <header className="w-full bg-primary animate-float-in-top z-30 sticky top-0 left-0 right-0 shadow-lg">
        <div className="max-w-[1200px] mx-auto py-4 w-[calc(100%-20px)] text-secondary flex justify-between items-center">
          <Button>
            <Link href="/">
              <Image
                src = "/logo/logo-primary.webp"
                alt = "Logo"
                priority
                width={168}
                height={47}
              />
            </Link>
          </Button>

          {/* Header Controls: Always Visible */}
          <div className="flex items-center gap-2">
            {/* Search & Cart Icons */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors relative group"
              aria-label="Search products"
            >
              <Search size={26} />
            </button>
            <button
              className="p-2 hover:bg-white/10 rounded-lg transition-colors relative group"
              onClick={() => router.push("/cart")}
            >
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
              <NavLink href="/gallery">DỰ ÁN</NavLink>
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
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-float-in-top">
              <nav>
                <ul className="flex flex-col gap-2 p-3 text-sm text-primary font-medium">
                  <NavLink href="/" isMobile onClick={closeMobileMenu}>
                    TRANG CHỦ
                  </NavLink>
                  <NavLink href="/about" isMobile onClick={closeMobileMenu}>
                    GIỚI THIỆU
                  </NavLink>
                  <NavLink
                    href="/products"
                    subItems={transformCategoriesToSubItems(categories)}
                    width="56"
                    isMobile
                    onClick={closeMobileMenu}
                  >
                    SẢN PHẨM
                  </NavLink>
                  <NavLink href="/gallery" isMobile onClick={closeMobileMenu}>
                    DỰ ÁN
                  </NavLink>
                  <NavLink href="/news" isMobile onClick={closeMobileMenu}>
                    TIN TỨC
                  </NavLink>
                  <NavLink href="/contact" isMobile onClick={closeMobileMenu}>
                    LIÊN HỆ
                  </NavLink>
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
                    isMobile
                    onClick={closeMobileMenu}
                  >
                    CHÍNH SÁCH
                  </NavLink>
                  {isAuthenticated && authService.isAdmin(account) && (
                    <NavLink href="/admin" isMobile onClick={closeMobileMenu}>
                      🛠️ Quản trị
                    </NavLink>
                  )}
                </ul>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={handleSearch}
      />
    </>
  );
}
