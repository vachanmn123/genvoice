"use client";

import { useMemo } from "react";
import { DollarSign, FileText, AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type Invoice from "@/lib/db/Invoices";

interface ClientStatsProps {
  invoices: Invoice[];
}

export function ClientStats({ invoices }: ClientStatsProps) {
  const stats = useMemo(() => {
    const totalInvoices = invoices.length;
    const totalAmount = invoices.reduce(
      (sum, invoice) => sum + invoice.total,
      0
    );
    const paidInvoices = invoices.filter(
      (invoice) => invoice.status === "paid"
    );
    const paidAmount = paidInvoices.reduce(
      (sum, invoice) => sum + invoice.total,
      0
    );
    const unpaidAmount = totalAmount - paidAmount;
    const overdueInvoices = invoices.filter(
      (invoice) => invoice.status === "overdue" || invoice.status === "sent"
    );
    const averageAmount = totalInvoices > 0 ? totalAmount / totalInvoices : 0;
    const paymentRate =
      totalInvoices > 0 ? (paidInvoices.length / totalInvoices) * 100 : 0;

    return {
      totalInvoices,
      totalAmount,
      paidInvoices: paidInvoices.length,
      paidAmount,
      unpaidAmount,
      overdueInvoices: overdueInvoices.length,
      averageAmount,
      paymentRate,
    };
  }, [invoices]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Total Invoices</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalInvoices}</div>
          <p className="text-xs text-muted-foreground">
            {stats.paidInvoices} paid,{" "}
            {stats.totalInvoices - stats.paidInvoices} unpaid
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Total Billed</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${stats.totalAmount.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">Lifetime value</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Outstanding</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${stats.unpaidAmount.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.overdueInvoices} overdue invoices
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Payment Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.paymentRate.toFixed(0)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Avg. ${stats.averageAmount.toFixed(2)} per invoice
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
