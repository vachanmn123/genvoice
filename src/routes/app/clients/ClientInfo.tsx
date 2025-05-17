import {
  ArrowLeft,
  Building,
  Mail,
  MapPin,
  Phone,
  FileText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientInvoices } from "@/components/ClientInvoices";
import { ClientStats } from "@/components/ClientStats";
import Client from "@/lib/db/Client";
import { Link, useNavigate, useParams } from "react-router";
import Invoice from "@/lib/db/Invoices";
import { EditClientDialog } from "@/components/EditClientDialog";
import { useState } from "react";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";

function Separator() {
  return <div className="w-full bg-primary h-1 my-2" />;
}

export default function ClientInfo() {
  const navigate = useNavigate();
  const params = useParams();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  if (!params.id) {
    return (
      <Card>
        <CardHeader>Client Not Found</CardHeader>
        <CardContent>
          <p>
            The client you are looking for does not exist. Please check the ID
          </p>
          <Link to="/app/clients">
            <Button>Go Back</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }
  const client = Client.getById(params.id);
  const invoices = Invoice.getByClientId(params.id);

  if (!client)
    return (
      <Card>
        <CardHeader>Client Not Found</CardHeader>
        <CardContent>
          <p>
            The client you are looking for does not exist. Please check the ID
          </p>
          <Link to="/app/clients">
            <Button>Go Back</Button>
          </Link>
        </CardContent>
      </Card>
    );

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
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="neutral"
              size="icon"
              onClick={() => navigate("/app/clients")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">{client.name}</h1>
            {client.taxID && (
              <Badge className="ml-2">Tax ID: {client.taxID}</Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Client Information Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>Contact details and address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium">Company</p>
                  <p className="text-sm text-muted-foreground">{client.name}</p>
                </div>
              </div>

              {client.contactPerson && (
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Contact Person</p>
                    <p className="text-sm text-muted-foreground">
                      {client.contactPerson}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {client.email}
                  </p>
                </div>
              </div>

              {client.phone && (
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {client.phone}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    {formatAddress(client.address)}
                  </p>
                </div>
              </div>

              {client.notes && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <p className="font-medium">Notes</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {client.notes}
                    </p>
                  </div>
                </>
              )}

              <Separator />
              <Button onClick={() => setEditOpen(true)} className="w-full">
                Edit Client
              </Button>
              <EditClientDialog
                client={client}
                onSave={(id, data) => {
                  Client.updateById(id, data);
                  setEditOpen(false);
                  navigate(`/app/clients/${id}`);
                }}
                open={editOpen}
                onOpenChange={setEditOpen}
              />

              <Button
                variant="neutral"
                className="w-full"
                onClick={() => setDeleteOpen(true)}
              >
                Delete Client
              </Button>
              <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                  <DialogTitle>Delete Client?</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this client? This action
                    cannot be undone.
                  </DialogDescription>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      variant="default"
                      onClick={() => {
                        Client.deleteById(client.id);
                        setDeleteOpen(false);
                        navigate("/app/clients");
                      }}
                    >
                      Delete Client
                    </Button>
                    <Button
                      variant="neutral"
                      onClick={() => setDeleteOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Client Stats and Invoices */}
          <div className="md:col-span-2 space-y-6">
            <ClientStats invoices={invoices} />

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Invoices</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <ClientInvoices invoices={invoices} filter="all" />
              </TabsContent>
              <TabsContent value="paid">
                <ClientInvoices
                  invoices={invoices.filter(
                    (invoice) => invoice.status === "paid"
                  )}
                  filter="paid"
                />
              </TabsContent>
              <TabsContent value="unpaid">
                <ClientInvoices
                  invoices={invoices.filter(
                    (invoice) => invoice.status === "unpaid"
                  )}
                  filter="unpaid"
                />
              </TabsContent>
              <TabsContent value="overdue">
                <ClientInvoices
                  invoices={invoices.filter(
                    (invoice) => invoice.status === "overdue"
                  )}
                  filter="overdue"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
