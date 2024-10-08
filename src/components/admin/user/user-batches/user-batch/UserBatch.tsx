"use client";

import "@/components/admin/super-admin/admin/style.scss";
import DashboardTitle from "@/components/admin/title/DashboardTitle";
import { useAuth } from "@/contexts/authContext";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
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
import {
  ErrorApollo,
  NetworkStatusApollo,
} from "@/components/default/error-loading/ErrorLoading";
import {
  ADD_STUDENTS_TO_BATCH_BY_USER_TOKEN,
  ASSIGN_BATCH_TO_STUDENT_BY_USER_TOKEN,
  GET_BATCH_BY_BATCH_ID_BY_USER,
  GET_BATCHES_BY_USER_TOKEN,
  GET_USER,
} from "@/graphql/graphql-utils";
import { useToast } from "@/contexts/toastContext";
import AddUpdateStudentsPopup from "../../addStudents/AddUpdateStudentsPopup";

type Props = {
  slug: string;
};

type UserType = {
  getUserByUserToken: User;
};

type BatchData = {
  getBatchByBatchIdByUserToken: Batch;
};

type BatchesData = {
  getAllBatchesByUserIdByUserToken: Batch[];
};

const UserBatch = ({ slug }: Props) => {
  const [role, setRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [asign, setAsign] = useState<{ id: string } | null>(null);
  const [asignBatchId, setAsignBatchId] = useState<string | null>(slug);
  const [functionType, setFunctionType] = useState<
    "add" | "update" | "addMultiple" | ""
  >("");
  const [updateId, setUpdateId] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");
  const [aadharNumber, setAadharNumber] = useState<number>(0);
  const [details, setDetails] = useState<boolean>(false);

  console.log("functionType->", functionType);

  const { token } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
    }
  }, []);

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

  const userDataProp = userData && userData.getUserByUserToken;

  const {
    data: batchData,
    error: batchError,
    loading: batchLoading,
    refetch: batchStudents,
  } = useQuery<BatchData>(GET_BATCH_BY_BATCH_ID_BY_USER, {
    variables: {
      batchId: slug,
      token,
    },
  });

  useEffect(() => {
    refetchUser();
    batchStudents();
  }, []);

  const batchDataProp = batchData && batchData.getBatchByBatchIdByUserToken;
  const studentData =
    (batchData && batchData.getBatchByBatchIdByUserToken.students) || [];

  const {
    data: batchesData,
    error: batchesError,
    loading: batchesLoading,
    refetch: refetchBatches,
  } = useQuery<BatchesData>(GET_BATCHES_BY_USER_TOKEN, {
    variables: {
      token,
      userId: userDataProp?.id,
    },
  });

  const batchesDataProp =
    batchesData && batchesData.getAllBatchesByUserIdByUserToken;

  //console.log("batchData->", batchData);

  const [assignBatchToStudentByUserToken, { loading: assignLoading }] =
    useMutation<BatchData>(ASSIGN_BATCH_TO_STUDENT_BY_USER_TOKEN, {
      onError: (error) => {
        console.log("error->", error);
        addToast(error.message || "Error asigning Student to Batch", "error");
      },
      refetchQueries: [
        { query: GET_USER, variables: { token } },
        {
          query: GET_BATCH_BY_BATCH_ID_BY_USER,
          variables: { batchId: slug, token },
        },
        {
          query: GET_BATCHES_BY_USER_TOKEN,
          variables: { token, userId: userDataProp?.id },
        },
      ],
      onCompleted: () => {
        addToast("Student assigned to Batch successfully", "success");
        setAsign(null);
      },
    });

  const [
    addStudentsByUser,
    { loading: addStudentsLoading, error: addStudentserror },
  ] = useMutation<Student>(ADD_STUDENTS_TO_BATCH_BY_USER_TOKEN, {
    onError: (error) => {
      console.log("error->", error.message);
      if (error.message.includes("Aadhar No. already exists")) {
        addToast("Aadhar No. already exists", "info");
      } else {
        addToast(error.message, "error");
      }
      return;
    },
    refetchQueries: [
      { query: GET_USER, variables: { token } },
      {
        query: GET_BATCH_BY_BATCH_ID_BY_USER,
        variables: { batchId: slug, token },
      },
      {
        query: GET_BATCHES_BY_USER_TOKEN,
        variables: { token, userId: userDataProp?.id },
      },
    ],
    onCompleted: () => {
      addToast("Student added to Batch successfully", "success");
    },
  });

  const handleAddButton = () => {
    setStudentName("");
    setAadharNumber(0);
    setFunctionType("add");
  };

  const handleAddMultipleButton = () => {
    setStudentName("");
    setAadharNumber(0);
    setFunctionType("addMultiple");
  };

  if (batchLoading) {
    return <NetworkStatusApollo />;
  }

  if (batchError) {
    return <ErrorApollo error={batchError} />;
  }

  return (
    <>
      <section id="userBatch">
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
                : `${userDataProp?.userName}`
            }
          />
          <div className="cards">
            <div className="links">
              <Link href="/user-dashboard/" className="link-back ">
                <ArrowLeft size={14} /> Dashboard
              </Link>
              <Link href="/user-dashboard/batches/" className="link-back ">
                <ArrowLeft size={14} /> All Batches
              </Link>
            </div>

            <PinkCard
              title={batchDataProp?.batchName}
              icon={<Shield size={16} strokeWidth={3} />}
              data={studentData}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleAddButton={handleAddButton}
              handleAddMultipleButton={handleAddMultipleButton}
            />
            {userData && batchDataProp && studentData?.length > 0 ? (
              studentData
                .filter(
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
                            disabled={batchesDataProp?.length === 0}
                            value={asignBatchId || ""}
                            onChange={(e) => setAsignBatchId(e.target.value)}
                          >
                            {batchesDataProp &&
                              batchesDataProp.length > 0 &&
                              batchesDataProp?.map((batch) => (
                                <option key={batch.id} value={batch.id}>
                                  {batch.batchName}
                                </option>
                              ))}
                          </select>
                          <button
                            disabled={
                              !asignBatchId ||
                              assignLoading ||
                              asignBatchId === slug
                            }
                            onClick={() => {
                              assignBatchToStudentByUserToken({
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
      {functionType !== "" && (
        <AddUpdateStudentsPopup
          title={
            functionType === "add"
              ? "Add Student"
              : functionType === "addMultiple"
              ? "Add Multiple Students"
              : "Update Student"
          }
          functionType={functionType}
          setFunctionType={setFunctionType}
          token={token}
          handleSubmitFunction={addStudentsByUser}
          loading={addStudentsLoading}
          error={addStudentserror}
          batchId={updateId}
          aadhar_number={aadharNumber}
          studentName={studentName}
        />
      )}
    </>
  );
};

export default UserBatch;
