"use client";

import "@/components/admin/dashboard.scss";
import Link from "next/link";
import DashboardTitle from "../title/DashboardTitle";
import { useQuery } from "@apollo/client";
import { GET_ALL_ADMINS } from "@/graphql/graphql-utils";
import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { useAuth } from "@/contexts/authContext";

type Data = {
  getAllAdmins: Admin[];
};

const SuperAdminDashboard = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
    }
  }, []);

  const { token } = useAuth();

  const { data, error, loading } = useQuery<Data>(GET_ALL_ADMINS, {
    variables: {
      token,
      limit: 200,
      start: 1,
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
        <Link
          title="View All Admins"
          href="/superAdmin-dashboard/admin"
          className="card"
        >
          <h5 className="highlight">
            <UserRound size={16} strokeWidth={3} />
            Admins
          </h5>
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
