"use client";

import "@/components/admin/super-admin/admin/style.scss";
import DashboardTitle from "@/components/admin/title/DashboardTitle";
import { useAuth } from "@/contexts/authContext";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  ASSIGN_BATCH_TO_STUDENT,
  GET_ADMIN,
  GET_ALL_BATCHES_ID_BATCHNAME_BY_ADMIN,
  GET_ALL_STUDENTS_BY_BATCH_ID_BY_USER_TOKEN,
  GET_BATCH_BY_BATCH_ID,
} from "@/graphql/graphql-utils";
import {
  ArrowLeft,
  Eye,
  Fingerprint,
  RefreshCw,
  Repeat,
  Shield,
} from "lucide-react";
import Link from "next/link";
import PinkCard from "@/components/default/pink-card/PinkCard";
import { IST } from "@/utils/time";
import { useToast } from "@/contexts/toastContext";
import {
  ErrorApollo,
  NetworkStatusApollo,
} from "@/components/default/error-loading/ErrorLoading";
import { usePathname, useRouter } from "next/navigation";

type AdminData = {
  getAdminByAdminToken: Admin;
};

type Data = {
  getBatchByBatchId: Batch;
};

type BatchData = {
  getAllBatchesByAdminId: Batch[];
};

type StudentsData = {
  getAllStudentsByBatchId: Student[];
};

const LIMIT = 10;

const AdminBatch = ({ slug }: { slug: string }) => {
  const [role, setRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [asign, setAsign] = useState<{ id: string } | null>(null);
  const [asignBatchId, setAsignBatchId] = useState<string | null>(slug);
  const [start, setStart] = useState<number>(0);

  const { addToast } = useToast();
  const pathname = usePathname();

  //console.log("pathname->", pathname);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
    }
  }, []);

  const { token } = useAuth();
  const router = useRouter();

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
    GET_BATCH_BY_BATCH_ID,
    {
      variables: {
        batchId: slug,
        token,
      },
    }
  );

  const {
    data: studentsData,
    error: studentsError,
    loading: studentsLoading,
    refetch: studentsRefetch,
  } = useQuery<StudentsData>(GET_ALL_STUDENTS_BY_BATCH_ID_BY_USER_TOKEN, {
    variables: {
      batchId: slug,
      token,
      limit: LIMIT,
      start,
    },
  });

  const totalData = data?.getBatchByBatchId.students.length || 0;
  const currentPage = Math.ceil(start / LIMIT) + 1;
  const totalPages = Math.ceil(totalData / LIMIT);

  const handleNext = () => {
    if (totalData > start + LIMIT) {
      setStart(start + LIMIT);
      router.push(`/admin-dashboard/batches/${slug}/#Header`);
    }
  };

  const handlePrevious = () => {
    if (start >= LIMIT) {
      setStart(start - LIMIT);
      router.push(`/admin-dashboard/batches/${slug}/#Header`);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  //console.log("studentsData->", studentsData);

  //console.log("data.getBatchByBatchId->", data?.getBatchByBatchId);

  useEffect(() => {
    refetch();
  }, []);

  const studentData = studentsData?.getAllStudentsByBatchId;

  const [assignStudentToBatch, { loading: assignLoading }] =
    useMutation<BatchData>(ASSIGN_BATCH_TO_STUDENT, {
      onError: (error) => {
        console.log("error->", error);
        addToast(error.message || "Error asigning Student to Batch", "error");
      },
      refetchQueries: [
        { query: GET_BATCH_BY_BATCH_ID, variables: { batchId: slug, token } },
        { query: GET_ADMIN, variables: { token } },
        { query: GET_ALL_BATCHES_ID_BATCHNAME_BY_ADMIN, variables: { token } },
      ],
      onCompleted: () => {
        addToast("Student assigned to Batch successfully", "success");
        setAsign(null);
      },
    });

  const {
    data: batchData,
    error: batchError,
    loading: batchLoading,
  } = useQuery<BatchData>(GET_ALL_BATCHES_ID_BATCHNAME_BY_ADMIN, {
    variables: {
      token,
      limit: 5000,
      start: 0,
    },
  });

  const batchDataProp = batchData?.getAllBatchesByAdminId;

  //console.log("asignBatchId->", asignBatchId);

  if (loading) {
    return <NetworkStatusApollo />;
  }

  if (error) {
    return <ErrorApollo error={error} />;
  }

  return (
    <section id="adminBatch">
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
            {pathname.includes("/admin-dashboard/users") ? (
              <>
                <Link
                  title="back to Dashboard"
                  href="/admin-dashboard/"
                  className="link-back "
                >
                  <ArrowLeft size={14} /> Dashboard
                </Link>
                <Link
                  title="Back to All Users"
                  href={`/admin-dashboard/users/`}
                  className="link-back "
                >
                  <ArrowLeft size={14} /> All Users
                </Link>
                <Link
                  title={`Back to ${data?.getBatchByBatchId.user.userName} User`}
                  href={`/admin-dashboard/users/${data?.getBatchByBatchId.user.id}`}
                  className="link-back "
                >
                  <ArrowLeft size={14} /> All Batches
                </Link>
              </>
            ) : pathname.includes("/admin-dashboard/batches/") ? (
              <>
                <Link
                  title="back To Dashboard"
                  href="/admin-dashboard/"
                  className="link-back "
                >
                  <ArrowLeft size={14} /> Dashboard
                </Link>
                <Link
                  title="Back to All Batches"
                  href="/admin-dashboard/batches/"
                  className="link-back "
                >
                  <ArrowLeft size={14} /> All Batches
                </Link>
              </>
            ) : (
              ""
            )}
          </div>
          <PinkCard
            title={data?.getBatchByBatchId.batchName}
            icon={<Shield size={16} strokeWidth={3} />}
            data={data?.getBatchByBatchId.students}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            loading={searchTerm !== debouncedSearchTerm}
          />
          <div className="prev_next">
            <button onClick={handlePrevious} disabled={start === 0}>
              Previous
            </button>
            {studentsLoading ? (
              <span>
                Loading{" "}
                <RefreshCw size={14} strokeWidth={3} className="loader" />
              </span>
            ) : (
              <span>
                Page {currentPage} of {totalPages}
              </span>
            )}

            <button onClick={handleNext} disabled={start + LIMIT >= totalData}>
              Next
            </button>
          </div>
          {data &&
          data.getBatchByBatchId &&
          studentData &&
          studentData.length > 0 ? (
            studentData
              .filter(
                (student) =>
                  student.studentName
                    .toLowerCase()
                    .includes(debouncedSearchTerm.toLowerCase()) ||
                  (student.aadhar_number &&
                    student.aadhar_number
                      .toString()
                      .includes(debouncedSearchTerm))
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
                          {student.details
                            ? student.details?.aadhar_number
                            : student.aadhar_number}
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
                      <button title="View or Update Student Details">
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
                          title="Change Batch of the Student"
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
                            asignBatchId === slug
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
              {studentsLoading ? (
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
            {studentsLoading ? (
              <span>
                Loading{" "}
                <RefreshCw size={14} strokeWidth={3} className="loader" />
              </span>
            ) : (
              <span>
                Page {currentPage} of {totalPages}
              </span>
            )}

            <button onClick={handleNext} disabled={start + LIMIT >= totalData}>
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminBatch;
