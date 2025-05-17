import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { EditClientDialog } from "@/components/EditClientDialog";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type Client from "@/lib/db/Client";
import type { ClientFormValues } from "@/components/EditClientDialog";
import { Link } from "react-router";

interface ClientTableProps {
  clients: Client[];
  isLoading: boolean;
  onUpdate: (id: string, data: Partial<Client>) => void;
}

export function ClientTable({
  clients,
  isLoading,
  onUpdate,
}: ClientTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.contactPerson &&
        client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSaveEdit = (id: string, data: ClientFormValues) => {
    onUpdate(id, { ...data });
    setEditingClient(null);
  };

  const formatAddress = (address: {
    building?: string;
    street?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  }) => {
    const parts = [];
    if (address.building) parts.push(address.building);
    if (address.street) parts.push(address.street);
    parts.push(address.city);
    parts.push(address.state);
    parts.push(address.country);
    parts.push(address.zipCode);
    return parts.filter(Boolean).join(", ");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Tax ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 7 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No clients found.
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    <Link
                      to={`/app/clients/${client.id}`}
                      className="hover:underline"
                    >
                      {client.name}
                    </Link>
                  </TableCell>
                  <TableCell>{client.contactPerson || "-"}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone || "-"}</TableCell>
                  <TableCell
                    className="max-w-xs truncate"
                    title={formatAddress(client.address)}
                  >
                    {formatAddress(client.address)}
                  </TableCell>
                  <TableCell>{client.taxID || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingClient && (
        <EditClientDialog
          client={editingClient}
          open={!!editingClient}
          onOpenChange={(open) => !open && setEditingClient(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
