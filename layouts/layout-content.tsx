"use client";

import React from "react";
import RootHeader from "@/components/common/root-header";
import RootFooter from "@/components/common/root-footer";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/layouts/admin-layout";
import authService from "@/services/authService";

interface LayoutContentProps {
    children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
    const { isAuthenticated, account } = useAuth();
    const isAdmin = isAuthenticated && account && authService.isAdmin(account);

    if (isAdmin) {
        return <AdminLayout>{children}</AdminLayout>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <RootHeader />
            <main className="flex-1">{children}</main>
            <RootFooter />
        </div>
    );
}