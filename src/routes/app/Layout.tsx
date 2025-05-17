import Company from "@/lib/db/Company";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";

export default function AppLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Company.isCompanySetup()) {
      navigate("/setup");
    }
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AppSidebar />
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
