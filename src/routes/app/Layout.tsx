import Company from "@/lib/db/Company";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export default function AppLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Company.isCompanySetup()) {
      navigate("/setup");
    }
  }, [navigate]);

  return <Outlet />;
}
