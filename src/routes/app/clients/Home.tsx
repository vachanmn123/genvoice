import { AddClientDialog } from "@/components/AddClientDialog";
import { ClientTable } from "@/components/ClientTable";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Client from "@/lib/db/Client";
import { Menu, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function ClientsHome() {
  const navigate = useNavigate();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <SidebarTrigger className="md:hidden">
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Clients Overview</h1>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="flex justify-between w-full mb-5">
          <div>
            <h2 className="text-xl font-semibold">All Clients</h2>
            <p className="text-sm text-muted">
              Here is an overview of all the clients
            </p>
          </div>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
          <AddClientDialog
            open={addDialogOpen}
            onOpenChange={() => setAddDialogOpen(false)}
            onSave={(data) => {
              const client = new Client(data);
              setAddDialogOpen(false);
              navigate(`/app/clients/${client.id}`);
            }}
          />
        </div>
        <ClientTable
          clients={Client.getAll()}
          isLoading={false}
          onUpdate={(id, data) => {
            Client.updateById(id, data);
          }}
        />
      </main>
    </SidebarInset>
  );
}
