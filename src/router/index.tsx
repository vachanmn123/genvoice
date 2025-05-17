import { createBrowserRouter } from "react-router";
import Home from "../routes/Home";
import Setup from "@/routes/Setup";
import AppLayout from "@/routes/app/Layout";
import Dashboard from "@/routes/app/Dashboard";

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
    children: [{ index: true, Component: Dashboard }],
  },
]);

export default router;
