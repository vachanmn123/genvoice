import { saveObject, getObject, getAllObjects } from "./utils";

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

class Invoice {
  id: string;
  clientId: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  date: string;
  dueDate: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;

  constructor(data: {
    clientId: string;
    invoiceNumber: string;
    status?: InvoiceStatus;
    date?: string;
    dueDate?: string;
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }>;
    subtotal: number;
    tax: number;
    total: number;
  }) {
    this.id = window.crypto.randomUUID();
    this.clientId = data.clientId;
    this.invoiceNumber = data.invoiceNumber;
    this.status = data.status || "draft";
    this.date = data.date || new Date().toISOString();
    this.dueDate =
      data.dueDate ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    this.items = data.items;
    this.subtotal = data.subtotal;
    this.tax = data.tax;
    this.total = data.total;

    saveObject("Invoice", this, this.id);
  }

  static getById(id: string) {
    return getObject("Invoice", id);
  }

  static getAll() {
    const allInvoices = getAllObjects("Invoice");
    if (!allInvoices) {
      return [];
    }
    return allInvoices;
  }

  static getByClientId(clientId: string) {
    const allInvoices = this.getAll();
    return allInvoices.filter((invoice) => invoice.clientId === clientId);
  }
}

export default Invoice;
