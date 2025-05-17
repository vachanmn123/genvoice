import { saveObject, getObject, getAllObjects } from "./utils";

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

type InvoiceItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

type InvoiceCreateInput = {
  clientId: string;
  invoiceNumber: string;
  status?: InvoiceStatus;
  date?: string;
  dueDate?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  id?: undefined;
};

type InvoiceLoadInput = {
  id: string;
};

type InvoiceInput = InvoiceCreateInput | InvoiceLoadInput;

class Invoice {
  id: string;
  clientId: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;

  constructor(data: InvoiceInput) {
    if ("id" in data && data.id) {
      const invoice = getObject("Invoice", data.id);
      this.id = invoice.id;
      this.clientId = invoice.clientId;
      this.invoiceNumber = invoice.invoiceNumber;
      this.status = invoice.status;
      this.date = invoice.date;
      this.dueDate = invoice.dueDate;
      this.items = invoice.items;
      this.subtotal = invoice.subtotal;
      this.tax = invoice.tax;
      this.total = invoice.total;
    } else {
      data = data as InvoiceCreateInput;
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
  }

  static getById(id: string) {
    return getObject("Invoice", id);
  }

  static updateById(id: string, data: Partial<Invoice>) {
    const invoice = this.getById(id);
    if (invoice) {
      const updatedInvoice = { ...invoice, ...data };
      saveObject("Invoice", updatedInvoice, id);
      return updatedInvoice;
    }
    return null;
  }

  static updateStatusById(id: string, status: InvoiceStatus) {
    const invoice = this.getById(id);
    if (invoice) {
      const updatedInvoice = { ...invoice, status };
      saveObject("Invoice", updatedInvoice, id);
      return updatedInvoice;
    }
    return null;
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

  public getTotal() {
    return (
      this.items.reduce((acc, item) => acc + item.totalPrice, 0) + this.tax
    );
  }

  public getSubtotal() {
    return this.items.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0
    );
  }
}

export default Invoice;
