"use client";

import "@/components/admin/super-admin/admin/style.scss";
import { useAuth } from "@/contexts/authContext";
import {
  ADD_BATCH_BY_USER_TOKEN,
  CHANGE_STATE_OF_BATCH_BY_USER,
  DELETE_BATCH_BY_USER_TOKEN,
  GET_BATCHES_BY_USER_TOKEN,
  GET_USER,
  UPDATE_BATCH_BY_USER_TOKEN,
} from "@/graphql/graphql-utils";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import DashboardTitle from "../../title/DashboardTitle";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  GraduationCap,
  Settings,
  Shield,
  Trash,
} from "lucide-react";
import PinkCard from "@/components/default/pink-card/PinkCard";
import {
  ErrorApollo,
  NetworkStatusApollo,
} from "@/components/default/error-loading/ErrorLoading";
import { IST } from "@/utils/time";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/toastContext";
import AddUpdateBatchStudentPopup from "../addbatch/AddUpdateBatchStudentPopup";

type BatchesData = {
  getAllBatchesByUserIdByUserToken: Batch[];
};

type UserType = {
  getUserByUserToken: User;
};

const UserBatches = () => {
  const [role, setRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [state, setState] = useState<string[]>([]);
  const [functionType, setFunctionType] = useState<"add" | "update" | "">("");
  const [batchName, setBatchName] = useState<string>("");
  const [inTime, setBatchInTime] = useState<string>("");
  const [outTime, setBatchOutTime] = useState<string>("");
  const [updateId, setUpdateId] = useState<string>("");
  const [confirmDelete, setConfirmDelete] = useState<{ id: string } | null>(
    null
  );

  const { token } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

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

  const [changeStateOfBatchByBatchIdByuser] = useMutation<BatchesData>(
    CHANGE_STATE_OF_BATCH_BY_USER,
    {
      onError: (error) => {
        console.log("error->", error);
        addToast(error.message || "Error changing state", "error");
      },
      refetchQueries: [
        {
          query: GET_BATCHES_BY_USER_TOKEN,
          variables: { token, userId: userDataProp?.id },
        },
        { query: GET_USER, variables: { token } },
      ],
      onCompleted: () => {
        addToast("State changed successfully", "success");
      },
    }
  );

  const [
    addBatchByUserToken,
    { loading: addBatchLoading, error: addBatchError },
  ] = useMutation<BatchesData>(ADD_BATCH_BY_USER_TOKEN, {
    onError: (error) => {
      console.log("error->", error.message);
      if (error.message.includes("Username already exists")) {
        addToast("Batch Name already exists", "info");
      } else {
        addToast(error.message, "error");
      }
      return;
    },
    refetchQueries: [
      {
        query: GET_BATCHES_BY_USER_TOKEN,
        variables: { token, userId: userDataProp?.id },
      },
      { query: GET_USER, variables: { token } },
    ],
    onCompleted: () => {
      addToast("Batch added successfully", "success");
      setBatchName("");
      setBatchInTime("");
      setBatchOutTime("");
      setFunctionType("");
    },
  });

  const [
    updateBatchByUserToken,
    { loading: updateBatchLoading, error: updatebatcherror },
  ] = useMutation<BatchesData>(UPDATE_BATCH_BY_USER_TOKEN, {
    onError: (error) => {
      console.log("error->", error.message);
      if (error.message.includes("Username already exists")) {
        addToast("Batch Name already exists", "info");
      } else {
        addToast(error.message, "error");
      }
      return;
    },
    refetchQueries: [
      {
        query: GET_BATCHES_BY_USER_TOKEN,
        variables: { token, userId: userDataProp?.id },
      },
      { query: GET_USER, variables: { token } },
    ],
    onCompleted: () => {
      addToast("Batch added successfully", "success");
      setBatchName("");
      setBatchInTime("");
      setBatchOutTime("");
      setFunctionType("");
    },
  });

  const [deleteBatchByUserToken, { loading: deleteLoading }] =
    useMutation<BatchesData>(DELETE_BATCH_BY_USER_TOKEN, {
      onError: (error) => {
        console.log("error->", error);
        addToast(error.message || "Error deleting batch", "error");
      },
      refetchQueries: [
        {
          query: GET_BATCHES_BY_USER_TOKEN,
          variables: { token, userId: userDataProp?.id },
        },
        { query: GET_USER, variables: { token } },
      ],
      onCompleted: () => {
        addToast("Batch deleted successfully", "success");
        setConfirmDelete(null);
        setSearchTerm("");
      },
    });

  useEffect(() => {
    refetchBatches();
    refetchUser();
  }, []);

  const handleAddButton = () => {
    setBatchName("");
    setBatchInTime("");
    setBatchOutTime("");
    setFunctionType("add");
  };

  const handleUpdateButton = (userName: string, id: string) => {
    setBatchName(userName);
    setBatchInTime("");
    setBatchOutTime("");
    setUpdateId(id);
    setFunctionType("update");
  };

  if (batchesLoading) {
    return <NetworkStatusApollo />;
  }

  if (batchesError) {
    return <ErrorApollo error={batchesError} />;
  }

  return (
    <>
      <section id="userBatches">
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
              <Link href="/user-dashboard/" className="link-back">
                <ArrowLeft size={14} /> Dashboard
              </Link>
            </div>
            <PinkCard
              title="Batches"
              icon={<Shield size={14} strokeWidth={3} />}
              data={batchesDataProp}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleAddButton={handleAddButton}
            />
            {userData && batchesDataProp && batchesDataProp.length > 0 ? (
              batchesDataProp
                .filter((batch) =>
                  batch.batchName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .sort((a, b) => a.batchName.localeCompare(b.batchName))
                .map((batch: Batch, i) => (
                  <div className="card" key={batch.id}>
                    <div className="batch-info">
                      <p className="highlight-yellow">
                        {batch.batchName} <span className="divider">|</span>{" "}
                        <span className="stats stats-s">
                          <GraduationCap size={14} strokeWidth={3} /> :{" "}
                          {batch.students ? batch.students.length : "N/A"}
                        </span>{" "}
                        <>
                          <span className="divider">|</span>{" "}
                          <span
                            className={`stats ${
                              batch.state ? "stats-active" : "stats-inActive"
                            }`}
                          >
                            {batch.state ? "\u2022" : "\u2022"}
                          </span>
                        </>
                      </p>
                      <div className="datetime batch-datetime">
                        <p className="text-s">
                          Created At:{" "}
                          <span className="highlight text-xs">
                            {new Date(parseInt(batch.createdAt))
                              .toLocaleString("en-IN", IST)
                              .replace(",", " |")}
                          </span>
                        </p>
                        <p className="text-s">
                          Updated At:{" "}
                          <span className="highlight text-xs">
                            {new Date(parseInt(batch.updatedAt))
                              .toLocaleString("en-IN", IST)
                              .replace(",", " |")}
                          </span>
                        </p>
                        <p className="text-s">
                          In Time:{" "}
                          <span className="highlight text-xs">
                            {batch.inTime}
                          </span>
                        </p>
                        <p className="text-s">
                          Out Time:{" "}
                          <span className="highlight text-xs">
                            {batch.outTime}
                          </span>
                        </p>
                        <p className="text-s">
                          User:{" "}
                          <span className="highlight text-xs">
                            {batch.user.userName}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="settings">
                      <button
                        id="delete-button"
                        onClick={() => {
                          if (confirmDelete?.id === batch.id) {
                            setConfirmDelete(null);
                          } else {
                            setConfirmDelete({ id: batch.id });
                          }
                        }}
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? "Deleting..." : <Trash />}
                      </button>
                      <select
                        value={
                          state?.length !== 0
                            ? state[i]
                            : batch.state.toString()
                        }
                        onChange={(e) => {
                          const newState = e.target.value === "true";
                          setState((priv) => {
                            priv[i] = String(newState);
                            return priv;
                          });
                          changeStateOfBatchByBatchIdByuser({
                            variables: {
                              token,
                              batchId: batch.id,
                              state: newState,
                            },
                          });
                        }}
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                      <button
                        id="settings-button"
                        onClick={() => {
                          handleUpdateButton(batch.batchName, batch.id);
                        }}
                      >
                        <Settings />
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/user-dashboard/batches/${batch.id}`)
                        }
                      >
                        <Eye />
                      </button>
                    </div>
                    {confirmDelete && confirmDelete?.id === batch.id && (
                      <div className="confirm-delete">
                        <p className="info-text">
                          Are you sure you want to delete this admin?
                        </p>
                        <div className="buttons">
                          <button
                            className="delete"
                            onClick={() => {
                              deleteBatchByUserToken({
                                variables: {
                                  token: token,
                                  deleteId: batch.id,
                                },
                              });
                            }}
                            disabled={deleteLoading}
                          >
                            {deleteLoading ? "Deleting..." : "Confirm"}
                          </button>
                          <button onClick={() => setConfirmDelete(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <div className="card">No Batches available.</div>
            )}
          </div>
        </div>
      </section>
      {functionType !== "" && (
        <AddUpdateBatchStudentPopup
          title={functionType === "add" ? "Add Batch" : "Update Batch"}
          setFunctionType={setFunctionType}
          functionType={functionType}
          token={token}
          handleSubmitFunction={
            functionType === "add"
              ? addBatchByUserToken
              : updateBatchByUserToken
          }
          batchName={batchName}
          inTime={inTime}
          outTime={outTime}
          updateId={updateId}
          setBatchName={setBatchName}
          setBatchInTime={setBatchInTime}
          setBatchOutTime={setBatchOutTime}
          error={functionType === "add" ? addBatchError : updatebatcherror}
          loading={
            functionType === "add" ? addBatchLoading : updateBatchLoading
          }
        />
      )}
    </>
  );
};

export default UserBatches;
