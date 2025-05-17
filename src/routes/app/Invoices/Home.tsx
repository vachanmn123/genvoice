import { InvoiceTable } from "@/components/InvoiceTable";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Invoice from "@/lib/db/Invoices";
import { Menu, Plus } from "lucide-react";
import { useNavigate } from "react-router";

export default function InvoicesHome() {
  const navigate = useNavigate();

  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <SidebarTrigger className="md:hidden">
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Invoices Overview</h1>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="flex justify-between w-full mb-5">
          <div>
            <h2 className="text-xl font-semibold">All Invoices</h2>
            <p className="text-sm text-muted-foreground">
              Manage and track all your invoices
            </p>
          </div>
          <Button onClick={() => navigate("/app/invoices/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
        <InvoiceTable invoices={Invoice.getAll()} isLoading={false} />
      </main>
    </SidebarInset>
  );
}
