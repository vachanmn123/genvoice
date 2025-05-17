import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Client from "@/lib/db/Client";
import Product from "@/lib/db/Product";
import Invoice from "@/lib/db/Invoices";
import Company from "@/lib/db/Company";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";

export default function Dashboard() {
  const company = new Company();
  const invoices = Invoice.getAll();
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Clients</CardTitle>
            <CardDescription>All registered clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Client.getCount()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Products</CardTitle>
            <CardDescription>Products in your catalog</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Product.getCount()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending Invoices</CardTitle>
            <CardDescription>Awaiting payment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                invoices.filter((i) => ["sent", "overdue"].includes(i.status))
                  .length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Revenue</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invoices
                .filter(
                  (i) =>
                    new Date(i.dueDate).getMonth() === new Date().getMonth()
                )
                .reduce((acc, inv) => acc + inv.total, 0)
                .toLocaleString("en-US", {
                  style: "currency",
                  currency: company.defaultCurrency ?? "USD",
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>Overview of your latest invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableHeader>

              <TableBody>
                {invoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No Recent Invoices.
                    </TableCell>
                  </TableRow>
                )}
                {invoices
                  .sort((a, b) => b.date - a.date)
                  .map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <Link
                          to={`/app/invoices/${invoice.id}`}
                          className="hover:underline"
                        >
                          {invoice.invoiceNumber}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/app/clients/${invoice.clientId}`}
                          className="hover:underline"
                        >
                          {Client.getById(invoice.clientId)?.name ||
                            invoice.clientId}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {new Date(invoice.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {invoice.total.toLocaleString("en-US", {
                          style: "currency",
                          currency: company.defaultCurrency ?? "USD",
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            invoice.status === "paid" ? "default" : "neutral"
                          }
                        >
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
