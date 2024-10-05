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
  GET_ALL_BATCHES_BY_ADMIN,
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
  //const [token, setToken] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [asign, setAsign] = useState<{ id: string } | null>(null);
  const [asignUserId, setAsignUserId] = useState<string | null>(slug);

  const router = useRouter();
  const { addToast } = useToast();

  const { token } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      //setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    }
  }, []);

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

  const [asignBatchToUser, { loading: asignLoading }] = useMutation<Data>(
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
        setSearchTerm("");
      },
    }
  );

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
              ? "Admin"
              : "User"
          }
        />

        <div className="cards">
          <Link href="/admin-dashboard/users/" className="link-back ">
            <ArrowLeft /> Users
          </Link>
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
              .map((batch: Batch) => (
                <div className="card" key={batch.id}>
                  <div className="batch-info">
                    <p className="highlight-yellow">
                      {batch.batchName} <span className="divider">|</span>{" "}
                      <span className="stats stats-s">
                        <GraduationCap size={14} strokeWidth={3} /> :{" "}
                        {batch.students ? batch.students.length : "N/A"}
                      </span>
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
                    <button
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
                        Asign this batch to another user:
                      </p>

                      <div className="buttons">
                        <select
                          className="asign-select"
                          disabled={usersDataProp?.length === 0}
                          value={asignUserId || ""} // Set value to asignUserId
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
                          disabled={!asignUserId || asignLoading}
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
                          {asignLoading ? (
                            <RefreshCw
                              size={14}
                              strokeWidth={3}
                              className="loader"
                            />
                          ) : (
                            <>
                              <Repeat size={14} strokeWidth={3} /> Asign
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
            <div className="card">No Batches available.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminUser;
