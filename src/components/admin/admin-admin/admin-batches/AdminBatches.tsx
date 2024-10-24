"use client";

import "@/components/admin/super-admin/admin/style.scss";
import DashboardTitle from "../../title/DashboardTitle";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { useMutation, useQuery } from "@apollo/client";
import {
  ASIGN_BATCH_TO_USER,
  CHANGE_STATE_OF_BATCH,
  GET_ADMIN,
  GET_ALL_BATCHES_BY_ADMIN,
  GET_ALL_BATCHES_BY_ADMIN_LENGTH,
  GET_ALL_USERS_BY_ADMIN,
} from "@/graphql/graphql-utils";
import PinkCard from "@/components/default/pink-card/PinkCard";
import {
  ArrowLeft,
  Eye,
  GraduationCap,
  RefreshCw,
  Repeat,
  Shield,
} from "lucide-react";
import { IST } from "@/utils/time";
import {
  ErrorApollo,
  NetworkStatusApollo,
} from "@/components/default/error-loading/ErrorLoading";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/toastContext";
import Link from "next/link";

type AdminData = {
  getAdminByAdminToken: Admin;
};

type BatchData = {
  getAllBatchesByAdminId: Batch[];
};

type UsersData = {
  getAllUsersByAdminToken: User[];
};

const LIMIT = 15;

const AdminBatches = () => {
  const [role, setRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [state, setState] = useState<string[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [asign, setAsign] = useState<{ id: string } | null>(null);
  const [asignUserId, setAsignUserId] = useState<string | null>(null);
  const [start, setStart] = useState<number>(0);

  const router = useRouter();
  const { addToast } = useToast();

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
    data: batchDataLength,
    error: batchErrorLength,
    loading: batchLoadingLength,
    refetch: refetchLength,
  } = useQuery<BatchData>(GET_ALL_BATCHES_BY_ADMIN_LENGTH, {
    variables: {
      token,
      limit: 20000,
      start: 0,
    },
  });

  const {
    data: batchData,
    error: batchError,
    loading: batchLoading,
    refetch,
  } = useQuery<BatchData>(GET_ALL_BATCHES_BY_ADMIN, {
    variables: {
      token,
      limli: LIMIT,
      start,
    },
  });

  const {
    data: allUsersData,
    error: allUsersError,
    loading: allUsersLoading,
  } = useQuery<UsersData>(GET_ALL_USERS_BY_ADMIN, {
    variables: {
      token,
    },
  });

  const usersDataProp = allUsersData?.getAllUsersByAdminToken;

  const [changeStateOfBatchByBatchIdByAdmin, { loading: changeStateLoading }] =
    useMutation<BatchData>(CHANGE_STATE_OF_BATCH, {
      onError: (error) => {
        console.log("error->", error);
        addToast(error.message || "Error changing state", "error");
      },
      refetchQueries: [
        {
          query: GET_ADMIN,
          variables: { token },
        },
        { query: GET_ALL_BATCHES_BY_ADMIN, variables: { token } },
      ],

      onCompleted: () => {
        addToast("State changed successfully", "success");
      },
    });

  const [asignBatchToUser, { loading: assignLoading }] = useMutation<BatchData>(
    ASIGN_BATCH_TO_USER,
    {
      onError: (error) => {
        console.log("error->", error);
        addToast(error.message || "Error asigning batch to user", "error");
      },
      refetchQueries: [
        {
          query: GET_ADMIN,
          variables: { token },
        },
        { query: GET_ALL_BATCHES_BY_ADMIN, variables: { token } },
      ],
      onCompleted: () => {
        addToast("Batch asigned successfully", "success");
        setAsign(null);
      },
    }
  );

  const batchdataProp = batchData?.getAllBatchesByAdminId;

  useEffect(() => {
    refetch();
  }, []);

  const totalData = batchDataLength?.getAllBatchesByAdminId.length || 0;
  const currentPage = Math.ceil(start / LIMIT) + 1;
  const totalPages = Math.ceil(totalData / LIMIT);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleNext = () => {
    if (totalData > start + LIMIT) {
      setStart(start + LIMIT);
      router.push("/admin-dashboard/batches/#Header");
    }
  };

  const handlePrevious = () => {
    if (start >= LIMIT) {
      setStart(start - LIMIT);
      router.push("/admin-dashboard/batches/#Header");
    }
  };

  if (batchLoading) {
    return <NetworkStatusApollo />;
  }

  if (batchError) {
    return <ErrorApollo error={batchError} />;
  }

  return (
    <section id="adminBatches">
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
              title="Back to dashboard"
              href="/admin-dashboard/"
              className="link-back"
            >
              <ArrowLeft size={14} /> Dashboard
            </Link>
          </div>
          <PinkCard
            title="Batches"
            icon={<Shield size={14} strokeWidth={3} />}
            data={batchDataLength?.getAllBatchesByAdminId}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            loading={searchTerm !== debouncedSearchTerm}
          />
          <div className="prev_next">
            <button onClick={handlePrevious} disabled={start === 0}>
              Previous
            </button>
            {batchLoading ? (
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
          {adminData && batchdataProp && batchdataProp.length > 0 ? (
            batchdataProp
              .filter((batch) =>
                batch.batchName
                  .toLowerCase()
                  .includes(debouncedSearchTerm.toLowerCase())
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
                    <select
                      title="Change State of Batch"
                      value={
                        state?.length !== 0 ? state[i] : batch.state.toString()
                      }
                      onChange={(e) => {
                        const newState = e.target.value === "true";
                        setState((priv) => {
                          priv[i] = String(newState);
                          return priv;
                        });
                        changeStateOfBatchByBatchIdByAdmin({
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
                      title="Assign Batch to another User"
                      onClick={() => {
                        if (asign?.id === batch.id) {
                          setAsign(null);
                        } else {
                          setAsign({ id: batch.id });
                          setAsignUserId(batch.userId);
                        }
                      }}
                    >
                      <Repeat />
                    </button>
                    <button
                      title="View Batch"
                      onClick={() =>
                        router.push(`/admin-dashboard/batches/${batch.id}`)
                      }
                    >
                      <Eye />
                    </button>
                  </div>
                  {asign && asign.id === batch.id && (
                    <div className="asign">
                      <p className="info-text">
                        Asign this Batch to another User:
                      </p>

                      <div className="buttons">
                        <select
                          title="Change User of Batch"
                          className="asign-select"
                          disabled={batchdataProp?.length === 0}
                          value={asignUserId || ""}
                          onChange={(e) => setAsignUserId(e.target.value)}
                        >
                          {usersDataProp &&
                            usersDataProp.length > 0 &&
                            usersDataProp?.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.userName}
                              </option>
                            ))}
                        </select>
                        <button
                          title="Confirm Assign Batch to User"
                          disabled={
                            !asignUserId ||
                            assignLoading ||
                            asignUserId === batch.userId
                          }
                          onClick={() => {
                            asignBatchToUser({
                              variables: {
                                token,
                                userId: asignUserId,
                                batchId: batch.id,
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
                          title="Cancle Asign Batch to User"
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
            <div className="card">No Batches available.</div>
          )}
          <div className="prev_next">
            <button onClick={handlePrevious} disabled={start === 0}>
              Previous
            </button>
            {batchLoading ? (
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

export default AdminBatches;
