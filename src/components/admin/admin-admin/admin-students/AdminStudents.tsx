"use client";

import "@/components/admin/super-admin/admin/style.scss";
import {
  ErrorApollo,
  NetworkStatusApollo,
} from "@/components/default/error-loading/ErrorLoading";
import { useAuth } from "@/contexts/authContext";
import {
  ASSIGN_BATCH_TO_STUDENT,
  GET_ADMIN,
  GET_ALL_BATCHES_BY_ADMIN,
  GET_ALL_STUDENTS_BY_ADMIN_TOKEN,
} from "@/graphql/graphql-utils";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import DashboardTitle from "../../title/DashboardTitle";
import {
  ArrowLeft,
  Eye,
  Fingerprint,
  GraduationCap,
  RefreshCw,
  Repeat,
} from "lucide-react";
import Link from "next/link";
import PinkCard from "@/components/default/pink-card/PinkCard";
import { IST } from "@/utils/time";
import { useToast } from "@/contexts/toastContext";

type AdminData = {
  getAdminByAdminToken: Admin;
};

type Data = {
  getAllStudentByAdminId: Student[];
};

type BatchData = {
  getAllBatchesByAdminId: Batch[];
};

const AdminStudents = () => {
  const [role, setRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [asign, setAsign] = useState<{ id: string } | null>(null);
  const [asignBatchId, setAsignBatchId] = useState<string | null>(null);

  const { token } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
    }
  }, []);

  const {
    data: adminData,
    error: adminError,
    loading: adminLoading,
  } = useQuery<AdminData>(GET_ADMIN, {
    variables: {
      token,
    },
  });

  const { data, error, loading, refetch } = useQuery<Data>(
    GET_ALL_STUDENTS_BY_ADMIN_TOKEN,
    {
      variables: {
        token,
      },
    }
  );

  const StudentsData = data?.getAllStudentByAdminId || [];
  const { addToast } = useToast();

  const {
    data: batchData,
    error: batchError,
    loading: batchLoading,
  } = useQuery<BatchData>(GET_ALL_BATCHES_BY_ADMIN, {
    variables: {
      token,
    },
  });

  const [assignStudentToBatch, { loading: assignLoading }] =
    useMutation<BatchData>(ASSIGN_BATCH_TO_STUDENT, {
      onError: (error) => {
        console.log("error->", error);
        addToast(error.message || "Error asigning Student to Batch", "error");
      },
      refetchQueries: [
        { query: GET_ALL_STUDENTS_BY_ADMIN_TOKEN, variables: { token } },
        { query: GET_ADMIN, variables: { token } },
        { query: GET_ALL_BATCHES_BY_ADMIN, variables: { token } },
      ],
      onCompleted: () => {
        addToast("Student assigned to Batch successfully", "success");
        setAsign(null);
      },
    });

  const batchDataProp = batchData?.getAllBatchesByAdminId;

  useEffect(() => {
    refetch();
  }, []);

  if (loading) {
    return <NetworkStatusApollo />;
  }

  if (error) {
    return <ErrorApollo error={error} />;
  }

  return (
    <section id="adminStudents">
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
              ? `${
                  adminLoading
                    ? "Loading..."
                    : adminData?.getAdminByAdminToken.userName
                }`
              : "User"
          }
        />
        <div className="cards">
          <div className="links">
            <Link href="/admin-dashboard/" className="link-back ">
              <ArrowLeft size={14} /> Dashboard
            </Link>
          </div>
          <PinkCard
            title="Students"
            icon={<GraduationCap size={16} strokeWidth={3} />}
            data={StudentsData}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          {adminData && StudentsData && StudentsData.length > 0 ? (
            StudentsData.filter(
              (student) =>
                student.studentName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                (student.aadhar_number &&
                  student.aadhar_number.toString().includes(searchTerm))
            )
              .sort((a, b) => a.studentName.localeCompare(b.studentName))
              .map((student) => (
                <div className="card">
                  <div className="student-info">
                    <p className="highlight-yellow">
                      {student.studentName} <span className="divider">|</span>{" "}
                      <span className="stats stats-s">
                        <Fingerprint size={14} strokeWidth={3} />{" "}
                        {student.fingerprints.length}
                      </span>
                    </p>
                    <div className="datetime student-datetime">
                      <p className="text-s">
                        Created At:{" "}
                        <span className="highlight text-xs">
                          {new Date(parseInt(student.createdAt))
                            .toLocaleString("en-IN", IST)
                            .replace(",", " |")}
                        </span>
                      </p>
                      <p className="text-s">
                        Updated At:{" "}
                        <span className="highlight text-xs">
                          {new Date(parseInt(student.updatedAt))
                            .toLocaleString("en-IN", IST)
                            .replace(",", " |")}
                        </span>
                      </p>
                      <p className="text-s">
                        Status:{" "}
                        <span className="highlight text-xs">
                          {student.state.length === 0
                            ? "Absent"
                            : student.state.includes("IN") &&
                              student.state.includes("OUT")
                            ? "IN-OUT"
                            : student.state.includes("IN")
                            ? "IN"
                            : "ABSENT"}
                        </span>
                      </p>
                      <p className="text-s">
                        Full Aadhar:{" "}
                        <span className="highlight text-xs">
                          {student.Details
                            ? student.Details?.aadhar_number
                            : student.aadhar_number}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="settings">
                    <button
                      onClick={() => {
                        if (asign?.id === student.id) {
                          setAsign(null);
                        } else {
                          setAsign({ id: student.id });
                          setAsignBatchId(student.batchId);
                        }
                      }}
                    >
                      <Repeat />
                    </button>
                    {student.Details && (
                      <button>
                        <Eye />
                      </button>
                    )}
                  </div>
                  {asign && asign.id === student.id && (
                    <div className="asign">
                      <p className="info-text">
                        Asign this Student to another Batch:
                      </p>
                      <div className="buttons">
                        <select
                          className="asign-select"
                          disabled={batchDataProp?.length === 0}
                          value={asignBatchId || ""}
                          onChange={(e) => setAsignBatchId(e.target.value)}
                        >
                          {batchDataProp &&
                            batchDataProp.length > 0 &&
                            batchDataProp?.map((batch) => (
                              <option key={batch.id} value={batch.id}>
                                {batch.batchName}
                              </option>
                            ))}
                        </select>
                        <button
                          disabled={
                            !asignBatchId ||
                            assignLoading ||
                            asignBatchId === student.batchId
                          }
                          onClick={() => {
                            assignStudentToBatch({
                              variables: {
                                token,
                                batchId: asignBatchId,
                                studentId: student.id,
                              },
                            });
                          }}
                        >
                          {assignLoading ? (
                            <RefreshCw
                              size={14}
                              strokeWidth={3}
                              className="loader"
                            />
                          ) : (
                            <>
                              <Repeat size={14} strokeWidth={3} /> Assign
                            </>
                          )}
                        </button>
                        <button onClick={() => setAsign(null)}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              ))
          ) : (
            <div className="card">No Students available.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminStudents;
