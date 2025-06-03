import { NavLink } from "@/components/custom/nav-link";
import { ThemeToggle } from "@/components/custom/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function RootHeader() {
    return (
        <>
            {/* Header Section */}
            <header className="w-full px-6 py-4 flex items-center justify-between border-b">
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>                    <span className="text-xl font-bold">LeeHai</span>
                </div>
                <nav className="flex items-center gap-6">
                    <NavLink href="/">Home</NavLink>
                    <NavLink href="/about">About</NavLink>
                    <NavLink href="/projects">Projects</NavLink>
                    <NavLink href="/blogs">Blogs</NavLink>
                    <NavLink href="/faq">FAQ</NavLink>
                    <NavLink href="/contact">Contact</NavLink>
                    <ThemeToggle />
                </nav>
            </header>
        </>
    )
}
