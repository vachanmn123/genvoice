import { formatCurrency, formatDate } from "@/lib/format";
import Invoice from "@/lib/db/Invoices";
import styles from "./FormalInvoice.module.css";
import Company from "@/lib/db/Company";
import Client from "@/lib/db/Client";

interface InvoiceViewProps {
  invoiceId?: string;
  companyName?: string;
  companyAddress?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyLogo?: string;
  clientName?: string;
  clientAddress?: string;
  clientEmail?: string;
  clientPhone?: string;
  previewData?: {
    invoiceNumber: string;
    date: string;
    dueDate: string;
    status: "draft" | "sent" | "paid" | "overdue";
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }>;
    subtotal: number;
    tax: number;
    total: number;
  };
}

const company = new Company();

export default function FormalInvoice({
  invoiceId,
  companyName = company.name,
  companyAddress = `${company.address.building} ${company.address.street}, ${company.address.city}, ${company.address.state}, ${company.address.country} - ${company.address.zip}`,
  companyEmail = company.email,
  companyPhone = company.phone,
  companyLogo = company.logoBase64,
  clientName = "Client Name",
  clientAddress = "456 Client Ave, City, State 12345",
  clientEmail = "client@example.com",
  clientPhone = "(555) 987-6543",
  previewData,
}: InvoiceViewProps) {
  // Use preview data if provided, otherwise fetch from db
  let invoiceData;
  let client;

  if (previewData) {
    // Use the provided preview data
    invoiceData = previewData;
  } else {
    // Fetch from database if we have an ID
    const invoice = Invoice.getById(invoiceId!);
    client = invoice ? Client.getById(invoice.clientId) : null;

    if (!invoice && invoiceId) {
      return <div className={styles["invoice-error"]}>Invoice not found</div>;
    }

    // Use fetched data or fall back to sample data
    invoiceData = invoice || {
      invoiceNumber: `INV-${new Date().getDate()}-001`,
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "draft" as const,
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
    };
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "#34D399"; // green
      case "sent":
        return "#60A5FA"; // blue
      case "overdue":
        return "#EF4444"; // red
      default:
        return "#9CA3AF"; // gray
    }
  };

  // If we're using an existing invoice with client info from DB
  const displayClientName = client?.name ?? clientName;
  const displayClientAddress = client
    ? `${client.address.building} ${client.address.street}, ${client.address.city}, ${client.address.state}, ${client.address.country} - ${client.address.zipCode}`
    : clientAddress;
  const displayClientEmail = client?.email ?? clientEmail;
  const displayClientPhone = client?.phone ?? clientPhone;

  return (
    <div className={styles["invoice-container"]}>
      <div className={styles["invoice-document"]}>
        <div className={styles["invoice-header"]}>
          <div className={styles["company-info"]}>
            <img
              src={companyLogo || "/placeholder.svg"}
              alt={companyName}
              className={styles["company-logo"]}
            />
            <div>
              <h2>{companyName}</h2>
              <p>{companyAddress}</p>
              <p>{companyEmail}</p>
              <p>{companyPhone}</p>
            </div>
          </div>
          <div className={styles["invoice-title"]}>
            <h1>INVOICE</h1>
            <div
              className={styles["invoice-status"]}
              style={{ backgroundColor: getStatusColor(invoiceData.status) }}
            >
              {invoiceData.status === "sent"
                ? "Due"
                : invoiceData.status.toUpperCase()}
            </div>
          </div>
        </div>

        <div className={styles["invoice-info"]}>
          <div className={styles["client-info"]}>
            <h3>Bill To:</h3>
            <h4>{displayClientName}</h4>
            <p className="text-wrap max-w-[300px]">{displayClientAddress}</p>
            <p>{displayClientEmail}</p>
            {displayClientPhone && <p>{displayClientPhone}</p>}
          </div>
          <div className={styles["invoice-details"]}>
            <div className={styles["detail-row"]}>
              <span className={styles["detail-label"]}>Invoice Number:</span>
              <span className={styles["detail-value"]}>
                {invoiceData.invoiceNumber}
              </span>
            </div>
            <div className={styles["detail-row"]}>
              <span className={styles["detail-label"]}>Invoice Date:</span>
              <span className={styles["detail-value"]}>
                {formatDate(invoiceData.date)}
              </span>
            </div>
            <div className={styles["detail-row"]}>
              <span className={styles["detail-label"]}>Due Date:</span>
              <span className={styles["detail-value"]}>
                {formatDate(invoiceData.dueDate)}
              </span>
            </div>
          </div>
        </div>

        <div className={styles["invoice-items"]}>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map(
                (
                  item: {
                    description: string;
                    quantity: number;
                    unitPrice: number;
                    totalPrice: number;
                  },
                  index: number
                ) => (
                  <tr key={index}>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.unitPrice)}</td>
                    <td>{formatCurrency(item.totalPrice)}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div className={styles["invoice-summary"]}>
          <div className={styles["summary-row"]}>
            <span className={styles["summary-label"]}>Subtotal:</span>
            <span className={styles["summary-value"]}>
              {formatCurrency(invoiceData.subtotal)}
            </span>
          </div>
          <div className={styles["summary-row"]}>
            <span className={styles["summary-label"]}>Tax:</span>
            <span className={styles["summary-value"]}>
              {formatCurrency(invoiceData.tax)}
            </span>
          </div>
          <div className={`${styles["summary-row"]} ${styles["total"]}`}>
            <span className={styles["summary-label"]}>Total:</span>
            <span className={styles["summary-value"]}>
              {formatCurrency(invoiceData.total)}
            </span>
          </div>
        </div>

        <div className={styles["invoice-thank-you"]}>
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
}
