"use client";

import Company from "@/lib/db/Company";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

const HEADER_TEXTS = {
  clients: "Clients",
  products: "Products",
  invoices: "Invoices",
  settings: "Settings",
};

export default function AppLayout() {
  const navigate = useNavigate();
  const currentPath = window.location.pathname.split("/app")[1].split("/")[1];
  console.log(currentPath);
  const headerText = Object.prototype.hasOwnProperty.call(
    HEADER_TEXTS,
    currentPath
  )
    ? HEADER_TEXTS[currentPath as keyof typeof HEADER_TEXTS]
    : "Dashboard Overview";

  useEffect(() => {
    if (!Company.isCompanySetup()) {
      navigate("/setup");
    }
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-col w-full overflow-hidden">
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6 shrink-0">
            <SidebarTrigger className="md:hidden">
              <Menu className="h-6 w-6" />
            </SidebarTrigger>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">{headerText}</h1>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
