"use client";

import DashboardTitle from "@/components/admin/title/DashboardTitle";
import { useEffect, useState } from "react";
import "@/components/admin/super-admin/admin/style.scss";
import PinkCard from "@/components/default/pink-card/PinkCard";
import {
  ArrowLeft,
  Eye,
  GraduationCap,
  RefreshCw,
  Repeat,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import {
  ASIGN_BATCH_TO_USER,
  CHANGE_STATE_OF_BATCH,
  GET_ADMIN,
  GET_ALL_BATCHES_BY_USER_ID,
  GET_ALL_USERS_BY_ADMIN,
  GET_USER_BY_USER_ID,
} from "@/graphql/graphql-utils";
import { useMutation, useQuery } from "@apollo/client";
import {
  ErrorApollo,
  NetworkStatusApollo,
} from "@/components/default/error-loading/ErrorLoading";
import { IST } from "@/utils/time";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/toastContext";
import { useAuth } from "@/contexts/authContext";

type AdminData = {
  getAdminByAdminToken: Admin;
};

type Data = {
  getAllBatchesByUserId: Batch[];
};

type UserData = {
  getUserByUserId: User;
};

type UsersData = {
  getAllUsersByAdminToken: User[];
};

const AdminUser = ({ slug }: { slug: string }) => {
  const [role, setRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [asign, setAsign] = useState<{ id: string } | null>(null);
  const [asignUserId, setAsignUserId] = useState<string | null>(slug);
  const [state, setState] = useState<string[]>([]);

  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
    }
  }, []);

  const { token } = useAuth();

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
    GET_ALL_BATCHES_BY_USER_ID,
    {
      variables: {
        token,
        userId: slug,
      },
    }
  );

  useEffect(() => {
    refetch();
  }, []);

  const {
    data: allUsersData,
    error: allUsersError,
    loading: allUsersLoading,
  } = useQuery<UsersData>(GET_ALL_USERS_BY_ADMIN, {
    variables: {
      token,
    },
  });

  //console.log("token->", token);

  const usersDataProp = allUsersData?.getAllUsersByAdminToken;

  //console.log("usersDataProp->", usersDataProp);

  const {
    data: userData,
    error: userError,
    loading: userLoading,
  } = useQuery<UserData>(GET_USER_BY_USER_ID, {
    variables: {
      token,
      userId: slug,
    },
  });

  //console.log("userData->", userData);

  const [asignBatchToUser, { loading: assignLoading }] = useMutation<Data>(
    ASIGN_BATCH_TO_USER,
    {
      onError: (error) => {
        console.log("error->", error);
        addToast(error.message || "Error asigning batch to user", "error");
      },
      refetchQueries: [
        {
          query: GET_ALL_BATCHES_BY_USER_ID,
          variables: { token, userId: slug },
        },
        { query: GET_ALL_USERS_BY_ADMIN, variables: { token } },
        { query: GET_USER_BY_USER_ID, variables: { token, userId: slug } },
      ],
      onCompleted: () => {
        addToast("Batch asigned successfully", "success");
        setAsign(null);
      },
    }
  );

  const [changeStateOfBatchByBatchIdByAdmin, { loading: changeStateLoading }] =
    useMutation<Data>(CHANGE_STATE_OF_BATCH, {
      onError: (error) => {
        console.log("error->", error);
        addToast(error.message || "Error changing state", "error");
      },
      refetchQueries: [
        {
          query: GET_ALL_BATCHES_BY_USER_ID,
          variables: { token, userId: slug },
        },
      ],
      onCompleted: () => {
        addToast("State changed successfully", "success");
      },
    });

  const userDataProp = userData?.getUserByUserId.batches;

  const BatchesData = data?.getAllBatchesByUserId;

  //console.log("BatchesData->", BatchesData);

  if (loading) {
    return <NetworkStatusApollo />;
  }

  if (error) {
    return <ErrorApollo error={error} />;
  }

  return (
    <section id="adminUser">
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
            <Link
              title="Back to All Users"
              href="/admin-dashboard/users/"
              className="link-back "
            >
              <ArrowLeft size={14} /> All Users
            </Link>
          </div>
          <PinkCard
            title={userData?.getUserByUserId.userName}
            icon={<UserRound size={16} strokeWidth={3} />}
            data={userDataProp}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          {data &&
          data.getAllBatchesByUserId &&
          BatchesData &&
          data.getAllBatchesByUserId.length > 0 ? (
            BatchesData.filter((batch) =>
              batch.batchName.toLowerCase().includes(searchTerm.toLowerCase())
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
                        }
                      }}
                    >
                      <Repeat />
                    </button>
                    <button
                      title="View Batch"
                      onClick={() =>
                        router.push(
                          `/admin-dashboard/users/${slug}/${batch.id}`
                        )
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
                          title="Change User of this Batch"
                          className="asign-select"
                          disabled={usersDataProp?.length === 0}
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
                          title="Confirm Assign Batch to another User"
                          disabled={
                            !asignUserId ||
                            assignLoading ||
                            asignUserId === slug
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
                          title="Cancle Assign Batch To User"
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
        </div>
      </div>
    </section>
  );
};

export default AdminUser;
