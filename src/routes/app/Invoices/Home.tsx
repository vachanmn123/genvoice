import { InvoiceTable } from "@/components/InvoiceTable";
import { Button } from "@/components/ui/button";
import Invoice from "@/lib/db/Invoices";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

export default function InvoicesHome() {
  const navigate = useNavigate();

  return (
    <>
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
    </>
  );
}
