"use client";

import "@/components/admin/dashboard.scss";
import {
  ErrorApollo,
  NetworkStatusApollo,
} from "@/components/default/error-loading/ErrorLoading";
import { useAuth } from "@/contexts/authContext";
import { GET_USER } from "@/graphql/graphql-utils";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import DashboardTitle from "../title/DashboardTitle";
import { GraduationCap, Shield } from "lucide-react";
import Link from "next/link";

type UserType = {
  getUserByUserToken: User;
};

const UserDashboard = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
    }
  }, []);

  const { token } = useAuth();

  const {
    data: userData,
    error: userError,
    loading: userLoading,
    refetch: refetchUser,
  } = useQuery<UserType>(GET_USER, {
    variables: {
      token,
    },
  });

  useEffect(() => {
    refetchUser();
  }, []);

  //console.log("userData->", userData);

  const userDataProp = userData && userData.getUserByUserToken;
  const batchDataProp = userDataProp && userDataProp.batches;

  const totalStudents = batchDataProp
    ? batchDataProp.reduce((acc, batch) => acc + batch.students.length, 0)
    : 0;

  //console.log("userDataProp->", userDataProp);
  //console.log("batchDataProp->", batchDataProp);

  if (userLoading) {
    return <NetworkStatusApollo />;
  }

  if (userError) {
    return <ErrorApollo error={userError} />;
  }

  return (
    <section id="userDashboard">
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
              ? "Admon"
              : `${userDataProp?.userName}`
          }
        />

        <div className="right">
          <Link
            title="View All Batches"
            href="/user-dashboard/batches"
            className="card"
          >
            <h5 className="highlight">
              <Shield size={16} strokeWidth={3} />
              Batches
            </h5>
            <p className="s-text">
              Total:{" "}
              {userError
                ? userError
                : userLoading
                ? "loading..."
                : batchDataProp?.length}
            </p>
          </Link>
          <Link
            title="View All Students"
            href="/user-dashboard/students"
            className="card"
          >
            <h5 className="highlight">
              <GraduationCap size={16} strokeWidth={3} />
              Students
            </h5>
            <p className="s-text">
              Total:{" "}
              {userError
                ? userError
                : userLoading
                ? "loading..."
                : totalStudents}
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UserDashboard;
