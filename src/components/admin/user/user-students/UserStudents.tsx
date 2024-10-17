"use client";

import "@/components/admin/super-admin/admin/style.scss";
import { useEffect, useState } from "react";
import DashboardTitle from "../../title/DashboardTitle";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_ALL_STUDENTS_BY_USER_TOKEN,
  GET_USER,
} from "@/graphql/graphql-utils";
import { useAuth } from "@/contexts/authContext";
import { useToast } from "@/contexts/toastContext";
import Link from "next/link";
import {
  ArrowLeft,
  Fingerprint,
  ReceiptText,
  RefreshCw,
  Shield,
} from "lucide-react";
import PinkCard from "@/components/default/pink-card/PinkCard";
import AddFingers from "../addFingers/AddFingers";
import { IST } from "@/utils/time";
import {
  ErrorApollo,
  NetworkStatusApollo,
} from "@/components/default/error-loading/ErrorLoading";

type UserType = {
  getUserByUserToken: User;
};

type StudentsType = {
  getAllStudentsByUserToken: Student[];
};

const UserStudents = () => {
  const [role, setRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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
    data: studentData,
    error: studentError,
    loading: studentLoading,
    refetch: studentRefetch,
  } = useQuery<StudentsType>(GET_ALL_STUDENTS_BY_USER_TOKEN, {
    variables: {
      token,
    },
  });

  const studentsDataType = studentData && studentData.getAllStudentsByUserToken;

  useEffect(() => {
    refetchUser();
    studentRefetch();
  }, []);

  if (userLoading) {
    return <NetworkStatusApollo />;
  }

  if (userError) {
    return <ErrorApollo error={userError} />;
  }

  return (
    <>
      <section id="userStudents">
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
              <Link
                title="Back to Dashboard"
                href="/user-dashboard/"
                className="link-back "
              >
                <ArrowLeft size={14} /> Dashboard
              </Link>
            </div>
            <PinkCard
              title="Students"
              icon={<Shield size={16} strokeWidth={3} />}
              data={studentsDataType}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            {userData &&
            studentData &&
            studentsDataType &&
            studentsDataType?.length > 0 ? (
              studentsDataType
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
                  <div className="card" key={student.id}>
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
                          Aadhar:{" "}
                          <span className="highlight text-xs">
                            {student.aadhar_number}{" "}
                            {student.details &&
                              `| ${student.details?.aadhar_number}`}
                          </span>
                        </p>
                        <p className="text-s">
                          Batch:{" "}
                          <span className="highlight text-xs">
                            {student.batch && student.batch.batchName}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="card">No Students available.</div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default UserStudents;
