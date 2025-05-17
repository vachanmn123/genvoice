import { Link } from "react-router";
import {
  Users,
  Package,
  FileText,
  Settings,
  Plus,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

function SidebarSeparator() {
  return <div className="w-full bg-primary h-1 my-2" />;
}

export default function DashboardSidebar() {
  const pathname = window.location.pathname;

  // Navigation items organized by category
  const navItems = {
    overview: [
      {
        title: "Dashboard",
        href: "/app",
        icon: LayoutDashboard,
      },
    ],
    management: [
      {
        title: "Clients",
        href: "/app/clients",
        icon: Users,
      },
      {
        title: "Products",
        href: "/app/products",
        icon: Package,
      },
      {
        title: "Invoices",
        href: "/app/invoices",
        icon: FileText,
      },
    ],
    system: [
      {
        title: "Settings",
        href: "/app/settings",
        icon: Settings,
      },
    ],
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex h-14 items-center px-4">
          <Link to="/app" className="flex items-center gap-2 font-semibold">
            <FileText className="h-6 w-6" />
            <span className="text-xl">Genvoice</span>
          </Link>
          <SidebarTrigger className="ml-auto md:hidden" />
        </div>
      </SidebarHeader>
      <SidebarContent className="py-2">
        {/* Overview Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
            OVERVIEW
          </SidebarGroupLabel>
          <SidebarMenu>
            {navItems.overview.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.title}
                  className={
                    (pathname === item.href
                      ? "bg-main border-border border-2"
                      : "") +
                    " hover:translate-y-[-3px] hover:translate-x-[-2.5px] transition-all"
                  }
                >
                  <Link to={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Management Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
            MANAGEMENT
          </SidebarGroupLabel>
          <SidebarMenu>
            {navItems.management.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.title}
                  className={
                    (pathname.includes(item.href)
                      ? "bg-main border-border border-2"
                      : "") +
                    " hover:translate-y-[-3px] hover:translate-x-[-2.5px] transition-all"
                  }
                >
                  <Link to={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        {/* System Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
            SYSTEM
          </SidebarGroupLabel>
          <SidebarMenu>
            {navItems.system.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.title}
                  className={
                    (pathname.includes(item.href)
                      ? "bg-main border-border border-2"
                      : "") +
                    " hover:translate-y-[-3px] hover:translate-x-[-2.5px] transition-all"
                  }
                >
                  <Link to={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <Button asChild className="w-full gap-2" size="sm">
          <Link to="/app/invoices/create">
            <Plus className="h-4 w-4" />
            <span>Create Invoice</span>
          </Link>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
