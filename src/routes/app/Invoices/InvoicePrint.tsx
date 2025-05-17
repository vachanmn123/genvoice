import FormalInvoice from "@/components/FormalInvoice";
import Invoice from "@/lib/db/Invoices";
import { useEffect } from "react";
import { useParams } from "react-router";

export default function InvoicePrint() {
  const { id } = useParams<{ id: string }>();

  const invoice = Invoice.getById(id!);

  useEffect(() => {
    window.print();
    return () => {
      window.close();
    };
  }, []);

  return <FormalInvoice invoiceId={id} {...invoice} />;
}
