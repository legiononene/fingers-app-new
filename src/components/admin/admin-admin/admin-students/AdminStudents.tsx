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
  GET_ALL_STUDENTS_LENGTH_BY_ADMNI_TOKEN,
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
import DetailsPopup from "./DetailsPopup";
import { useRouter } from "next/navigation";

type AdminData = {
  getAdminByAdminToken: Admin;
};

type Data = {
  getAllStudentByAdminId: Student[];
};

type BatchData = {
  getAllBatchesByAdminId: Batch[];
};

const LIMIT = 10;

const AdminStudents = () => {
  const [role, setRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [asign, setAsign] = useState<{ id: string } | null>(null);
  const [asignBatchId, setAsignBatchId] = useState<string | null>(null);
  const [openDetailsId, setOpenDetailsId] = useState<string>("");
  const [start, setStart] = useState<number>(0);

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

  const {
    data: lengthData,
    error: lengthError,
    loading: lengthLoading,
    refetch: lengthRefetch,
  } = useQuery<Data>(GET_ALL_STUDENTS_LENGTH_BY_ADMNI_TOKEN, {
    variables: {
      token,
      limit: 5000,
      start: 0,
    },
  });

  const { data, error, loading, refetch } = useQuery<Data>(
    GET_ALL_STUDENTS_BY_ADMIN_TOKEN,
    {
      variables: {
        token,
        limit: LIMIT,
        start,
      },
    }
  );

  const totalData = lengthData?.getAllStudentByAdminId.length || 0;
  const currentPage = Math.ceil(start / LIMIT) + 1;
  const totalPages = Math.ceil(totalData / LIMIT);

  const router = useRouter();

  const handleNext = () => {
    if (totalData > start + LIMIT) {
      setStart(start + LIMIT);
      router.push("/admin-dashboard/students/#Header");
    }
  };

  const handlePrevious = () => {
    if (start >= LIMIT) {
      setStart(start - LIMIT);
      router.push("/admin-dashboard/students/#Header");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const StudentsData = data?.getAllStudentByAdminId || [];

  const { addToast } = useToast();

  console.log("StudentsData->", StudentsData);

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
    <>
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
              <Link
                title="Back to Dashboard"
                href="/admin-dashboard/"
                className="link-back "
              >
                <ArrowLeft size={14} /> Dashboard
              </Link>
            </div>
            <PinkCard
              title="Students"
              icon={<GraduationCap size={16} strokeWidth={3} />}
              data={lengthData?.getAllStudentByAdminId}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              loading={searchTerm !== debouncedSearchTerm}
            />
            <div className="prev_next">
              <button onClick={handlePrevious} disabled={start === 0}>
                Previous
              </button>
              {loading ? (
                <span>
                  Loading{" "}
                  <RefreshCw size={14} strokeWidth={3} className="loader" />
                </span>
              ) : (
                <span>
                  Page {currentPage} of {totalPages}
                </span>
              )}

              <button
                onClick={handleNext}
                disabled={start + LIMIT >= totalData}
              >
                Next
              </button>
            </div>
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
                            {student.aadhar_number}{" "}
                            {student.details &&
                              `| ${student.details?.aadhar_number}`}
                          </span>
                        </p>
                        <p className="text-s">
                          User:{" "}
                          <span className="highlight text-xs">
                            {student.batch.user.userName}
                          </span>
                        </p>
                        <p className="text-s">
                          Batch:{" "}
                          <span className="highlight text-xs">
                            {student.batch.batchName}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="settings">
                      <button
                        title="Assign Student to another Batch"
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
                      {student.details && (
                        <button
                          title="View or Change Student Detalis"
                          onClick={() => setOpenDetailsId(student.id)}
                        >
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
                            title="Change Batch of Student"
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
                            title="Confirm Assign Student to another Batch"
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
                          <button
                            title="Cancle Assign Student to Batch"
                            onClick={() => setAsign(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <>
                {loading ? (
                  <div className="card">
                    <span>
                      Loading{" "}
                      <RefreshCw size={14} strokeWidth={3} className="loader" />
                    </span>{" "}
                  </div>
                ) : (
                  <div className="card">No Students available.</div>
                )}
              </>
            )}
            <div className="prev_next">
              <button onClick={handlePrevious} disabled={start === 0}>
                Previous
              </button>
              {loading ? (
                <span>
                  Loading{" "}
                  <RefreshCw size={14} strokeWidth={3} className="loader" />
                </span>
              ) : (
                <span>
                  Page {currentPage} of {totalPages}
                </span>
              )}

              <button
                onClick={handleNext}
                disabled={start + LIMIT >= totalData}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
      {openDetailsId !== "" && (
        <DetailsPopup
          openDetailsId={openDetailsId}
          setOpenDetailsId={setOpenDetailsId}
          data={StudentsData}
        />
      )}
    </>
  );
};

export default AdminStudents;
