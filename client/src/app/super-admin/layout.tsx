"use client";

import SuperAdminSideBar from "@/components/super-admin/sidebar";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <SuperAdminSideBar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
        className={cn(
          "transition-all duration-300",
          isSidebarOpen ? "ml-64" : "ml-16",
          "min-h-screen"
        )}
      >
        {children}
      </div>
    </div>
  );
}
