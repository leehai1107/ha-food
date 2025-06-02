import { AdminSidebar } from "@/components/custom/admin-sidebar"
import { redirect } from "next/navigation";

async function getSession() {
    // TODO: Implement real authentication
    return { user: { role: "admin" } };
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();


    if (session?.user?.role !== "admin") {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
} 