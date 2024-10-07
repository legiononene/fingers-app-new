"use client";

import "@/components/admin/dashboard.scss";
import {
  GET_ADMIN,
  GET_ALL_BATCHES_BY_ADMIN,
  GET_ALL_STUDENTS_BY_ADMIN,
  GET_ALL_USERS_BY_ADMIN,
} from "@/graphql/graphql-utils";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import DashboardTitle from "../title/DashboardTitle";
import Link from "next/link";
import { GraduationCap, Shield, UserRound } from "lucide-react";
import {
  ErrorApollo,
  NetworkStatusApollo,
} from "@/components/default/error-loading/ErrorLoading";
import { useAuth } from "@/contexts/authContext";

type Data = {
  getAdminByAdminToken: Admin;
};

type UserData = {
  getAllUsersByAdminToken: User[];
};

type BatchData = {
  getAllBatchesByAdminId: Batch[];
};

type StudentData = {
  getAllStudentByAdminId: Student[];
};

const Admindashboard = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
    }
  }, []);

  const { token } = useAuth();

  const { data, error, loading, refetch } = useQuery<Data>(GET_ADMIN, {
    variables: {
      token,
    },
  });

  const {
    data: userData,
    error: userError,
    loading: userLoading,
    refetch: refetchUser,
  } = useQuery<UserData>(GET_ALL_USERS_BY_ADMIN, {
    variables: {
      token,
    },
  });

  const {
    data: batchData,
    error: batchError,
    loading: batchLoading,
    refetch: refetchBatch,
  } = useQuery<BatchData>(GET_ALL_BATCHES_BY_ADMIN, {
    variables: {
      token,
    },
  });

  const {
    data: studentData,
    error: studentError,
    loading: studentLoading,
    refetch: refetchStudent,
  } = useQuery<StudentData>(GET_ALL_STUDENTS_BY_ADMIN, {
    variables: {
      token,
    },
  });

  useEffect(() => {
    refetch();
    refetchUser();
    refetchBatch();
    refetchStudent();
  }, []);

  if (loading) {
    return <NetworkStatusApollo />;
  }

  if (error) {
    return <ErrorApollo error={error} />;
  }

  // console.log("token->", token);
  // console.log("data->", data);
  // console.log("userData->", userData);
  // console.log("batchData->", batchData);
  // console.log("studentData->", studentData);

  return (
    <section id="adminDashboard">
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
              ? `${data?.getAdminByAdminToken.userName}`
              : "User"
          }
        />
        <div className="right">
          <Link href="/admin-dashboard/users" className="card">
            <h5 className="highlight">
              <UserRound size={16} strokeWidth={3} />
              Users
            </h5>
            <p className="s-text">
              Total:{" "}
              {userError
                ? userError.message
                : userLoading
                ? "loading..."
                : userData?.getAllUsersByAdminToken.length}
            </p>
          </Link>
          <Link href="/admin-dashboard/batches" className="card">
            <h5 className="highlight">
              <Shield size={16} strokeWidth={3} />
              Batches
            </h5>
            <p className="s-text">
              Total:{" "}
              {batchError
                ? batchError.message
                : batchLoading
                ? "loading..."
                : batchData?.getAllBatchesByAdminId.length}
            </p>
          </Link>
          <Link href="/admin-dashboard/students" className="card">
            <h5 className="highlight">
              <GraduationCap size={16} strokeWidth={3} />
              Students
            </h5>
            <p className="s-text">
              Total:{" "}
              {studentError
                ? studentError.message
                : studentLoading
                ? "loading..."
                : studentData?.getAllStudentByAdminId.length}
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Admindashboard;
