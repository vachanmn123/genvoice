import { AddClientDialog } from "@/components/AddClientDialog";
import { ClientTable } from "@/components/ClientTable";
import { Button } from "@/components/ui/button";
import Client from "@/lib/db/Client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function ClientsHome() {
  const navigate = useNavigate();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  return (
    <>
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
    </>
  );
}
