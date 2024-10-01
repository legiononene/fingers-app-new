"use client";

import "@/components/admin/dashboard.scss";
import Link from "next/link";
import DashboardTitle from "../title/DashboardTitle";
import { useQuery } from "@apollo/client";
import { GET_ALL_ADMINS } from "@/graphql/graphql-utils";
import { useEffect, useState } from "react";

type Data = {
  getAllAdmins: Admin[];
};

const SuperAdminDashboard = () => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    }
  }, []);

  const { data, error, loading } = useQuery<Data>(GET_ALL_ADMINS, {
    variables: {
      token,
    },
  });

  return (
    <section id="superAdminDashboard">
      <div className="fg">
        <DashboardTitle
          role={
            role === "superAdmin"
              ? "Super Admin"
              : role === "admin"
              ? "Admin"
              : "User"
          }
          userName={
            role === "superAdmin"
              ? "legionOne"
              : role === "admin"
              ? "Admin"
              : "User"
          }
        />
        <Link href="/superAdmin-dashboard/admin" className="card">
          <h5 className="highlight">Admins</h5>
          <p className="s-text">
            Total:{" "}
            {error
              ? error.message
              : loading
              ? "loading..."
              : data?.getAllAdmins.length}
          </p>
        </Link>
      </div>
    </section>
  );
};

export default SuperAdminDashboard;
