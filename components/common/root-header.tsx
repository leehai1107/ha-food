import { NavLink } from "@/components/custom/nav-link";
import { Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

export default function RootHeader() {
    return (
        <>
            {/* Header Section */}
            <header className="w-full bg-primary">
                <div className="flex items-center justify-between gap-4 px-24 py-4 text-secondary">
                    <Button className="py-4">
                        <Image
                            src="/logo/logo-primary.png"
                            alt="Logo"
                            width={168}
                            height={47}
                        />
                    </Button>
                    <div className="flex items-center gap-2">
                        <button>
                            <Search size={26} />
                        </button>
                        <button>
                            <ShoppingCart size={26} />
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-4 text-primary-white bg-dark-red">
                    <nav>
                        <ul className="flex items-center gap-4 list-none">
                            <NavLink href="/">TRANG CHỦ</NavLink>
                            <NavLink href="/about">GIỚI THIỆU</NavLink>
                            <NavLink
                                href="/products"
                                subItems={[
                                    { href: "/products/product-a", label: "Product A" },
                                    { href: "/products/product-b", label: "Product B" },
                                    { href: "/products/product-c", label: "Product C" },
                                    { href: "/products/product-d", label: "Product D" },
                                ]}
                            >
                                SẢN PHẨM
                            </NavLink>
                            <NavLink href="/news">TIN TỨC</NavLink>
                            <NavLink href="/contact">LIÊN HỆ</NavLink>
                            <NavLink href="/legal"
                                subItems={
                                    [
                                        { href: "/legal/privacy-policy", label: "Chính sách bảo mật" },
                                        { href: "/legal/terms-of-service", label: "Điều khoản sử dụng" },
                                    ]
                                }>CHÍNH SÁCH</NavLink>
                        </ul>
                    </nav>
                </div>

            </header>
        </>
    )
}
