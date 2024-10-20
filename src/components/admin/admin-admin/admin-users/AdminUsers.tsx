"use client";

import "@/components/admin/super-admin/admin/style.scss";
import { useEffect, useState } from "react";
import DashboardTitle from "../../title/DashboardTitle";
import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_USER,
  DELETE_USER,
  GET_ADMIN,
  GET_ALL_USERS_BY_ADMIN,
  UPDATE_USER,
} from "@/graphql/graphql-utils";
import {
  ErrorApollo,
  NetworkStatusApollo,
} from "@/components/default/error-loading/ErrorLoading";
import PinkCard from "@/components/default/pink-card/PinkCard";
import {
  ArrowLeft,
  Eye,
  GraduationCap,
  Settings,
  Shield,
  Trash,
  UserRound,
} from "lucide-react";
import { IST } from "@/utils/time";
import { useToast } from "@/contexts/toastContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  DynamicConfirmDeleteLoader,
  DynamicPopupLoader,
} from "@/utils/DynamicLoader";

type Data = {
  getAdminByAdminToken: Admin;
};

type UserData = {
  getAllUsersByAdminToken: User[];
};

const DynamicAddUpdateAdminUserPopup = dynamic(
  () => import("../../super-admin/admin/addAdmin/AddUpdateAdminUserPopup"),
  {
    ssr: false,
    loading: () => <DynamicPopupLoader />,
  }
);

const DynamicConfirmDelete = dynamic(
  () => import("@/components/default/confirmDelete/ConfirmDelete"),
  {
    ssr: false,
    loading: () => <DynamicConfirmDeleteLoader />,
  }
);

const AdminUsers = () => {
  const [role, setRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{ id: string } | null>(
    null
  );
  const [functionType, setFunctionType] = useState<"add" | "update" | "">("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [updateId, setUpdateId] = useState<string>("");

  const { addToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
    }
  }, []);
  const { token } = useAuth();

  const { data, error, loading, refetch } = useQuery<Data>(GET_ADMIN, {
    variables: {
      token,
    },
  });

  const {
    data: userData,
    error: userError,
    loading: userLoading,
    refetch: userRefetch,
  } = useQuery<UserData>(GET_ALL_USERS_BY_ADMIN, {
    variables: {
      token,
    },
  });

  useEffect(() => {
    refetch();
    userRefetch();
  }, []);

  const [
    addUserByAdminToken,
    { loading: addUserLoading, error: addUserError },
  ] = useMutation<UserData>(ADD_USER, {
    onError: (error) => {
      console.log("error->", error.message);
      if (error.message.includes("Username already exists")) {
        addToast("Username already exists", "info");
      } else {
        addToast(error.message, "error");
      }
      return;
    },
    refetchQueries: [GET_ALL_USERS_BY_ADMIN, "getAllUsersByAdminToken"],
    onCompleted: () => {
      addToast("User added successfully", "success");
      setUserName("");
      setPassword("");
      setConfirmPassword("");
      setFunctionType("");
    },
  });

  const [updateUserByAdminToken, { loading: updateLoading }] =
    useMutation<UserData>(UPDATE_USER, {
      onError: (error) => {
        if (error.message.includes("Username already exists")) {
          addToast("Username already exists", "info");
        } else {
          addToast(error.message, "error");
        }
        return;
      },
      refetchQueries: [GET_ALL_USERS_BY_ADMIN, "getAllUsersByAdminToken"],
      onCompleted: () => {
        addToast("User updated successfully", "success");
        setUserName("");
        setPassword("");
        setConfirmPassword("");
        setFunctionType("");
        setUpdateId("");
      },
    });

  const [deleteUserByAdmintoken, { loading: deleteLoading }] =
    useMutation<UserData>(DELETE_USER, {
      onError: (error) => {
        console.log("error->", error);
        addToast(error.message || "Error deleting user", "error");
      },
      refetchQueries: [GET_ALL_USERS_BY_ADMIN, "getAllUsersByAdminToken"],
      onCompleted: () => {
        addToast("User deleted successfully", "success");
        setConfirmDelete(null);
        setSearchTerm("");
      },
    });

  const userDataProp = userData?.getAllUsersByAdminToken;

  //console.log("userDataProp->", userDataProp);

  const handleAddButton = () => {
    setUserName("");
    setPassword("");
    setFunctionType("add");
  };

  const handleUpdateButton = (userName: string, id: string) => {
    setPassword("");
    setUserName(userName);
    setUpdateId(id);
    setFunctionType("update");
  };

  if (loading && userLoading) {
    return <NetworkStatusApollo />;
  }

  if (error && userError) {
    return <ErrorApollo error={error ? error : userError} />;
  }

  return (
    <>
      <section id="adminUsers">
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
                ? `${data?.getAdminByAdminToken.userName}`
                : "User"
            }
          />
          <div className="cards">
            <div className="links">
              <Link
                title="Back to Dashboard"
                href="/admin-dashboard/"
                className="link-back"
              >
                <ArrowLeft size={14} /> Dashboard
              </Link>
            </div>
            <PinkCard
              title="Users"
              icon={<UserRound size={16} strokeWidth={3} />}
              data={userDataProp}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleAddButton={handleAddButton}
            />
            {data &&
            userData?.getAllUsersByAdminToken &&
            userDataProp &&
            userData.getAllUsersByAdminToken.length > 0 ? (
              userDataProp
                .filter((user) =>
                  user.userName.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .sort((a, b) => a.userName.localeCompare(b.userName))
                .map((user: User) => (
                  <>
                    <div className="card" key={user.id}>
                      <div className="info">
                        <p className="highlight-yellow">
                          {" "}
                          {user.userName} <span className="divider">|</span>{" "}
                          <span className="stats stats-b">
                            <Shield size={14} strokeWidth={3} /> :{" "}
                            {user.batches ? user.batches.length : "N/A"}{" "}
                          </span>
                          <span className="divider">|</span>{" "}
                          <span className="stats stats-s">
                            <GraduationCap size={14} strokeWidth={3} /> :{" "}
                            {user.batches
                              ? user.batches.reduce(
                                  (totalStudents, batch) =>
                                    totalStudents +
                                    (batch.students
                                      ? batch.students.length
                                      : 0),
                                  0
                                )
                              : "N/A"}
                          </span>
                        </p>
                        <div className="datetime">
                          <p className="text-s">
                            Created At:{" "}
                            <span className="highlight text-xs">
                              {new Date(parseInt(user.createdAt))
                                .toLocaleString("en-IN", IST)
                                .replace(",", " |")}
                            </span>
                          </p>
                          <p className="text-s">
                            Updated At:{" "}
                            <span className="highlight text-xs">
                              {new Date(parseInt(user.updatedAt))
                                .toLocaleString("en-IN", IST)
                                .replace(",", " |")}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="settings">
                        <button
                          title="Delete User"
                          id="delete-button"
                          onClick={() => {
                            if (confirmDelete?.id === user.id) {
                              setConfirmDelete(null);
                            } else {
                              setConfirmDelete({ id: user.id });
                            }
                          }}
                          disabled={deleteLoading}
                        >
                          {deleteLoading ? "Deleting..." : <Trash />}
                        </button>
                        <button
                          title="Update User"
                          id="settings-button"
                          onClick={() => {
                            handleUpdateButton(user.userName, user.id);
                          }}
                        >
                          <Settings />
                        </button>
                        <button
                          title="View User"
                          onClick={() =>
                            router.push(`/admin-dashboard/users/${user.id}`)
                          }
                        >
                          <Eye />
                        </button>
                      </div>

                      {confirmDelete && confirmDelete?.id === user.id && (
                        <DynamicConfirmDelete
                          deleteTitle="User"
                          token={token}
                          deleteId={user.id}
                          deleteFunction={deleteUserByAdmintoken}
                          deleteLoading={deleteLoading}
                          cancelFunction={setConfirmDelete}
                        />
                      )}
                    </div>
                  </>
                ))
            ) : (
              <div className="card">No users available.</div>
            )}
          </div>
        </div>
      </section>
      {functionType !== "" && (
        <DynamicAddUpdateAdminUserPopup
          setFunctionType={setFunctionType}
          handleSubmitFunction={
            functionType === "add"
              ? addUserByAdminToken
              : updateUserByAdminToken
          }
          id={updateId}
          error={addUserError}
          userName={userName}
          password={password}
          confirmPassword={confirmPassword}
          setUserName={setUserName}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          loading={functionType === "add" ? addUserLoading : updateLoading}
          title={functionType === "add" ? "Add User" : "Update User"}
          functionType={functionType}
          token={token}
        />
      )}
    </>
  );
};

export default AdminUsers;
