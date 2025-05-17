import { createBrowserRouter } from "react-router";
import Home from "../routes/Home";
import Setup from "@/routes/Setup";
import AppLayout from "@/routes/app/layout";

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
    children: [{ index: true, element: <div>Hello!</div> }],
  },
]);

export default router;
