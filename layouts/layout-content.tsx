"use client";

import React from "react";
import RootHeader from "@/components/common/root-header";
import RootFooter from "@/components/common/root-footer";
import { useAuth } from "@/contexts/AuthContext";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role } = useAuth();

  return (
    <>
      {role === "admin" ? <div>Admin Panel Header</div> : <RootHeader />}
      <main>{children}</main>
      {role === "admin" ? <div>Admin Panel Footer</div> : <RootFooter />}
    </>
  );
}