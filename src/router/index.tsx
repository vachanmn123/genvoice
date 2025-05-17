import { createBrowserRouter } from "react-router";
import Home from "../routes/Home";
import Setup from "@/routes/Setup";
import AppLayout from "@/routes/app/Layout";
import Dashboard from "@/routes/app/Dashboard";
import ClientsHome from "@/routes/app/clients/Home";
import ClientInfo from "@/routes/app/clients/ClientInfo";
import ProductsHome from "@/routes/app/products/Home";
import InvoicesHome from "@/routes/app/Invoices/Home";
import CreateInvoice from "@/routes/app/Invoices/Create";
import InvoiceDetailPage from "@/routes/app/Invoices/InvoiceInfo";
import InvoicePrint from "@/routes/app/Invoices/InvoicePrint";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/setup",
    element: <Setup />,
  },
  {
    path: "/app",
    Component: AppLayout,
    children: [
      { index: true, Component: Dashboard },
      {
        path: "clients",
        children: [
          { index: true, Component: ClientsHome },
          { path: ":id", Component: ClientInfo },
        ],
      },
      {
        path: "products",
        children: [{ index: true, Component: ProductsHome }],
      },
      {
        path: "invoices",
        children: [
          { index: true, Component: InvoicesHome },
          {
            path: "create",
            Component: CreateInvoice,
          },
          {
            path: ":id",
            Component: InvoiceDetailPage,
          },
        ],
      },
    ],
  },

  {
    path: "/app/invoices/:id/print",
    Component: InvoicePrint,
  },
]);

export default router;
