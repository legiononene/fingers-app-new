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
  ReceiptText,
  RefreshCw,
  Repeat,
  Settings,
  Shield,
  Trash,
} from "lucide-react";
import Link from "next/link";
import PinkCard from "@/components/default/pink-card/PinkCard";
import { IST } from "@/utils/time";
import {
  ErrorApollo,
  NetworkStatusApollo,
} from "@/components/default/error-loading/ErrorLoading";
import {
  ADD_DETAILS_TO_STUDENT_BY_STUDENT_ID_BY_USER_TOKEN,
  ADD_FINGERPRINTS_TO_STUDENT_BY_USER_TOKEN,
  ADD_MULTIPLE_STUDENTS_TO_BATCH_BY_USER_TOKEN,
  ADD_STUDENT_TO_BATCH_BY_USER_TOKEN,
  ASSIGN_BATCH_TO_STUDENT_BY_USER_TOKEN,
  DELETE_STUDENT_BY_STUDENT_ID_BY_USER_TOKEN,
  GET_BATCH_BY_BATCH_ID_BY_USER,
  GET_BATCHES_BY_USER_TOKEN,
  GET_USER,
  UPDATE_DETAILS_OF_STUDENT_BY_STUDENT_ID_BY_USER_TOKEN,
  UPDATE_STUDENT_BY_STUDENT_ID_BY_USER_TOKEN,
} from "@/graphql/graphql-utils";
import { useToast } from "@/contexts/toastContext";
import dynamic from "next/dynamic";
import {
  DynamicConfirmDeleteLoader,
  DynamicPopupLoader,
} from "@/utils/DynamicLoader";

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

const DynamicAddFingers = dynamic(() => import("../../addFingers/AddFingers"), {
  ssr: false,
  loading: () => <DynamicPopupLoader />,
});

const DynamicAddDetails = dynamic(() => import("../../addDetails/AddDetails"), {
  ssr: false,
  loading: () => <DynamicPopupLoader />,
});

const DynamicAddUpdateStudentsPopup = dynamic(
  () => import("../../addStudents/AddUpdateStudentsPopup"),
  {
    ssr: false,
    loading: () => <DynamicPopupLoader />,
  }
);
const DynamicConfirmDelete = dynamic(
  () => import("../../../../default/confirmDelete/ConfirmDelete"),
  {
    ssr: false,
    loading: () => <DynamicConfirmDeleteLoader />,
  }
);

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
  const [aadharNumber, setAadharNumber] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [confirmDelete, setConfirmDelete] = useState<{ id: string } | null>(
    null
  );
  const [fingerPrintOpen, setFingerPrintOpen] = useState<{ id: string } | null>(
    null
  );
  const [studentId, setStudentId] = useState<string>("");
  const [detailsFunctionType, setDetailsFunctionType] = useState<
    "add" | "update" | ""
  >("");

  const [detailsId, setDetailsId] = useState<string>();
  const [studentDetails, setStudentDetails] = useState<Details>({
    aadhar_number: "",
    mobile: "",
    email: "",
    address: "",
    domicileState: "",
    domicileDistrict: "",
    idType: "",
    dob: new Date(),
    gender: "",
    maritalStatus: "",
    fatherGuardian: "",
    motherGuardian: "",
    religion: "",
    castCategory: "",
    disability: false,
    disabilityType: undefined,
    employed: false,
    employmentStatus: undefined,
    employmentDetails: undefined,
    trainingProgram: "",
  });

  const [statusMessage, setStatusMessage] = useState<string>("");

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

  //console.log("batchData->", batchData);

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
    addStudentByUser,
    { loading: addStudentLoading, error: addStudentError },
  ] = useMutation<Student>(ADD_STUDENT_TO_BATCH_BY_USER_TOKEN, {
    onError: (error) => {
      console.log("error->", error.message);

      if (error.message.includes("Aadhar No. already exists")) {
        addToast(`${error.message}`, "info");
        setErrorMessage(`${error.message}`);
      } else {
        addToast(error.message, "error");
        setErrorMessage(`${error.message}`);
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
      setStudentName("");
      setAadharNumber("");
      setFunctionType("");
      setConfirmDelete(null);
    },
  });

  const [
    addMultipleStudentsByUser,
    { loading: addMultipleStudentsLoading, error: addMultipleStudentsError },
  ] = useMutation<Student>(ADD_MULTIPLE_STUDENTS_TO_BATCH_BY_USER_TOKEN, {
    onError: (error) => {
      console.log("error->", error.message);
      if (error.message.includes("Aadhar No. already exists")) {
        addToast(`${error.message}`, "info");
        setErrorMessage(`${error.message}`);
      } else {
        addToast(error.message, "error");
        setErrorMessage(`${error.message}`);
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
      addToast("Students added to Batch successfully", "success");
      setStudentName("");
      setAadharNumber("");
      setFunctionType("");
      setConfirmDelete(null);
    },
  });

  const [
    addFingerPrints,
    { loading: addFingerPrintsLoading, error: addFingerPrintsError },
  ] = useMutation<FingerPrint>(ADD_FINGERPRINTS_TO_STUDENT_BY_USER_TOKEN, {
    onError: (error) => {
      console.log("error->", error);
      addToast(
        error.message || "Error adding fingerprints to student",
        "error"
      );
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
      addToast("Fingerprints Added to Student successfully", "success");
      setConfirmDelete(null);
    },
  });

  const [
    updateStudentByUserToken,
    {
      data: updateStudentData,
      loading: updateStudentLoading,
      error: updateStudentError,
    },
  ] = useMutation<Student>(UPDATE_STUDENT_BY_STUDENT_ID_BY_USER_TOKEN, {
    onError: (error) => {
      console.error("error->", error.message);
      if (error.message.includes("Aadhar No. already exists")) {
        addToast(`${error.message}`, "info");
        setErrorMessage(`${error.message}`);
      } else {
        addToast(error.message, "error");
        setErrorMessage(`${error.message}`);
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
      addToast("Student Updated successfully", "success");
      setStudentName(studentName);
      setAadharNumber(aadharNumber);
      setUpdateId(updateId);
      setFunctionType("");
      setConfirmDelete(null);
    },
  });

  const [
    deleteStudentByUserToken,
    {
      data: deleteStudentDate,
      loading: deleteStudentLoading,
      error: deleteStudentError,
    },
  ] = useMutation(DELETE_STUDENT_BY_STUDENT_ID_BY_USER_TOKEN, {
    onError: (error) => {
      console.error("error->", error.message);
      addToast(error.message || "Error deleting Student", "error");
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
      addToast("Student deleted successfully", "success");
      setConfirmDelete(null);
    },
  });

  const [addDetailsToStudent, { loading: addDetailsLoading }] = useMutation(
    ADD_DETAILS_TO_STUDENT_BY_STUDENT_ID_BY_USER_TOKEN,
    {
      onError: (error) => {
        console.error("error->", error.message);
        addToast(error.message || "Error adding details", "error");
        setStatusMessage(error.message);
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
      onCompleted: (data) => {
        addToast("Details added successfully", "success");
        console.log("data->", data);
        setDetailsFunctionType("");
      },
    }
  );

  const [
    updateDetailsOfStudent,
    { loading: updateDetailsLoading, error: updateDetailsError },
  ] = useMutation(UPDATE_DETAILS_OF_STUDENT_BY_STUDENT_ID_BY_USER_TOKEN, {
    onError: (error) => {
      console.error("error->", error.message);
      addToast(error.message || "error updating Details", "error");
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
      addToast("Details updated successfully", "success");
      setDetailsFunctionType("");
    },
  });

  const handleAddButton = () => {
    setStudentName("");
    setAadharNumber("");
    setFunctionType("add");
    setConfirmDelete(null);
  };

  const handleAddMultipleButton = () => {
    setStudentName("");
    setAadharNumber("");
    setFunctionType("addMultiple");
    setConfirmDelete(null);
  };

  const handleUpdateButton = (
    studentName: string,
    aadharNumber: string,
    id: string
  ) => {
    setStudentName(studentName);
    setAadharNumber(aadharNumber);
    setUpdateId(id);
    setFunctionType("update");
    setConfirmDelete(null);
    setAsign(null);
  };

  const handleUpdateDetailsButton = (
    studentId: string,
    aNo: string,
    mob: string,
    email: string,
    address: string,
    domicileState: string,
    domicileDistrict: string,
    idType: string,
    dob: Date,
    gender: string,
    maritalStatus: string,
    father: string,
    mother: string,
    religion: string,
    cast: string,
    disability: boolean,
    disabilityType: string,
    employed: boolean,
    employmentStatus: string,
    employmentDetails: string,
    trainingProgram: string
  ) => {
    setStudentDetails({
      aadhar_number: aNo,
      mobile: mob,
      email: email,
      address: address,
      domicileState: domicileState,
      domicileDistrict: domicileDistrict,
      idType: idType,
      dob: dob,
      gender: gender,
      maritalStatus: maritalStatus,
      fatherGuardian: father,
      motherGuardian: mother,
      religion: religion,
      castCategory: cast,
      disability: disability,
      disabilityType: disabilityType,
      employed: employed,
      employmentStatus: employmentStatus,
      employmentDetails: employmentDetails,
      trainingProgram: trainingProgram,
    });

    setUpdateId(studentId); // If needed, this can remain separate
    setDetailsFunctionType("update");
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
              <Link
                title="Back to Dashboard"
                href="/user-dashboard/"
                className="link-back "
              >
                <ArrowLeft size={14} /> Dashboard
              </Link>
              <Link
                title="Back to All Batches"
                href="/user-dashboard/batches/"
                className="link-back "
              >
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
                            {new Date(student.createdAt)
                              .toLocaleString("en-IN", IST)
                              .replace(",", " |")}
                          </span>
                        </p>
                        <p className="text-s">
                          Updated At:{" "}
                          <span className="highlight text-xs">
                            {new Date(student.updatedAt)
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
                      </div>
                    </div>
                    <div className="settings">
                      <button
                        title="Delete this Student"
                        id="delete-button"
                        onClick={() => {
                          if (confirmDelete?.id === student.id) {
                            setConfirmDelete(null);
                          } else {
                            setConfirmDelete({ id: student.id });
                            setAsign(null);
                          }
                        }}
                      >
                        <Trash />
                      </button>
                      <button
                        title="Assign this Student to another Batch"
                        onClick={() => {
                          if (asign?.id === student.id) {
                            setAsign(null);
                          } else {
                            setAsign({ id: student.id });
                            setAsignBatchId(student.batch.id);
                            setConfirmDelete(null);
                          }
                        }}
                      >
                        <Repeat />
                      </button>
                      <button
                        title="View or Add or Delete Fingerprints"
                        onClick={() => {
                          if (fingerPrintOpen?.id === student.id) {
                            setFingerPrintOpen(null);
                          } else {
                            setFingerPrintOpen({ id: student.id });
                          }
                        }}
                      >
                        <Fingerprint />
                      </button>
                      <button
                        title={
                          student.details
                            ? "View or Update Student Details"
                            : "Add Student Details"
                        }
                        onClick={() => {
                          if (student.details) {
                            handleUpdateDetailsButton(
                              student.id,
                              student.details.aadhar_number,
                              student.details.mobile,
                              student.details.email,
                              student.details.address,
                              student.details.domicileState,
                              student.details.domicileDistrict,
                              student.details.idType,
                              student.details.dob,
                              student.details.gender,
                              student.details.maritalStatus,
                              student.details.fatherGuardian,
                              student.details.motherGuardian,
                              student.details.religion,
                              student.details.castCategory,
                              student.details.disability,
                              student.details.disabilityType || "",
                              student.details.employed,
                              student.details.employmentStatus || "",
                              student.details.employmentDetails || "",
                              student.details.trainingProgram
                            );
                            setDetailsId(student.details.id);
                          } else {
                            setDetailsFunctionType("add");
                            setStudentId(student.id);
                          }
                        }}
                      >
                        <ReceiptText />
                      </button>
                      <button
                        title="Update Student"
                        onClick={() => {
                          handleUpdateButton(
                            student.studentName,
                            student.aadhar_number,
                            student.id
                          );
                        }}
                      >
                        <Settings />
                      </button>
                    </div>
                    {confirmDelete && confirmDelete?.id === student.id && (
                      <DynamicConfirmDelete
                        deleteTitle="Student"
                        token={token}
                        deleteId={student.id}
                        deleteFunction={deleteStudentByUserToken}
                        deleteLoading={deleteStudentLoading}
                        cancelFunction={setConfirmDelete}
                      />
                    )}
                    {asign && asign.id === student.id && (
                      <div className="asign">
                        <p className="info-text">
                          Asign this Student to another Batch:
                        </p>
                        <div className="buttons">
                          <select
                            title="Change Batch of this Student"
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
                            title="Confirm Assign Student to another Batch"
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
                          <button
                            title="Cancle Assign Student to Batch"
                            onClick={() => setAsign(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {fingerPrintOpen && fingerPrintOpen.id === student.id && (
                      <DynamicAddFingers
                        fingerPrintOpen={fingerPrintOpen}
                        setfingerPrintOpen={setFingerPrintOpen}
                        data={student}
                        studentData={student.fingerprints}
                        token={token}
                        handleAddFinger={addFingerPrints}
                        loading={addFingerPrintsLoading}
                        slug={slug}
                      />
                    )}
                  </div>
                ))
            ) : (
              <div className="card">No Students available.</div>
            )}
          </div>
        </div>
      </section>
      {detailsFunctionType !== "" && (
        <DynamicAddDetails
          detailsId={detailsId}
          studentDetails={studentDetails}
          setStudentDetails={setStudentDetails}
          title={
            detailsFunctionType === "add" ? "Add Details" : "update Details"
          }
          studentId={studentId}
          setStudentId={setStudentId}
          token={token}
          functionType={detailsFunctionType}
          setFunctionType={setDetailsFunctionType}
          setStatusMessage={setStatusMessage}
          statusMessage={statusMessage}
          addDetailsToStudent={addDetailsToStudent}
          updateDetailsOfStudent={updateDetailsOfStudent}
          addDetailsLoading={addDetailsLoading}
          updateDetailsLoading={updateDetailsLoading}
        />
      )}
      {functionType !== "" && (
        <DynamicAddUpdateStudentsPopup
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
          handleSubmitFunction={
            functionType === "add"
              ? addStudentByUser
              : functionType === "addMultiple"
              ? addMultipleStudentsByUser
              : updateStudentByUserToken
          }
          loading={
            functionType === "add"
              ? addStudentLoading
              : functionType === "addMultiple"
              ? addMultipleStudentsLoading
              : updateStudentLoading
          }
          error={
            functionType === "add"
              ? addStudentError
              : functionType === "addMultiple"
              ? addMultipleStudentsError
              : updateStudentError
          }
          batchId={slug}
          aadhar_number={aadharNumber}
          setAadharNumber={setAadharNumber}
          setStudentName={setStudentName}
          studentName={studentName}
          updateId={updateId}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </>
  );
};

export default UserBatch;
