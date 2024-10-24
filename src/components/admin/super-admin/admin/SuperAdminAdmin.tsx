"use client";

import { Settings, Trash, UserRound } from "lucide-react";
import DashboardTitle from "../../title/DashboardTitle";
import "./style.scss";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { IST } from "@/utils/time";
import PinkCard from "@/components/default/pink-card/PinkCard";
import {
  ErrorApollo,
  NetworkStatusApollo,
} from "@/components/default/error-loading/ErrorLoading";
import { useToast } from "@/contexts/toastContext";
import {
  ADD_ADMIN,
  DELETE_ADMIN,
  GET_ALL_ADMINS,
  UPDATE_ADMIN,
} from "@/graphql/graphql-utils";
import { useAuth } from "@/contexts/authContext";
import {
  DynamicConfirmDeleteLoader,
  DynamicPopupLoader,
} from "@/utils/DynamicLoader";
import dynamic from "next/dynamic";

type Data = {
  getAllAdmins: Admin[] | undefined;
};

const DynamicAddUpdateAdminUserPopup = dynamic(
  () => import("./addAdmin/AddUpdateAdminUserPopup"),
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

const SuperAdminAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{ id: string } | null>(
    null
  );
  const [functionType, setFunctionType] = useState<"add" | "update" | "">("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [updateId, setUpdateId] = useState<string>("");
  const [role, setRole] = useState<string | null>(null);

  const { addToast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
    }
  }, []);

  const { token } = useAuth();

  const { data, error, networkStatus } = useQuery<Data>(GET_ALL_ADMINS, {
    variables: {
      token,
      limit: 200,
      start: 0,
    },
  });

  const [addAdminByToken, { loading: addAdminLoading, error: addAdminError }] =
    useMutation<Data>(ADD_ADMIN, {
      onError: (error) => {
        if (error.message.includes("Username already exists")) {
          addToast("Username already exists", "info");
        } else {
          addToast(error.message, "error");
        }
        return;
      },
      refetchQueries: [GET_ALL_ADMINS, "getAllAdmins"],
      onCompleted: () => {
        addToast("Admin added successfully", "success");
        setUserName("");
        setPassword("");
        setConfirmPassword("");
        setFunctionType("");
      },
    });

  const [updateAdminById, { loading: updateLoading }] = useMutation<Data>(
    UPDATE_ADMIN,
    {
      onError: (error) => {
        if (error.message.includes("Username already exists")) {
          addToast("Username already exists", "info");
        } else {
          addToast(error.message, "error");
        }
        return;
      },
      refetchQueries: [GET_ALL_ADMINS, "getAllAdmins"],
      onCompleted: () => {
        addToast("Admin updated successfully", "success");
        setUserName("");
        setPassword("");
        setConfirmPassword("");
        setFunctionType("");
        setUpdateId("");
      },
    }
  );

  const [deleteAdmin, { loading: deleteLoading }] = useMutation<Data>(
    DELETE_ADMIN,
    {
      refetchQueries: [GET_ALL_ADMINS, "getAllAdmins"],
      onCompleted: () => {
        addToast("Admin deleted successfully", "success");
        setConfirmDelete(null);
        setSearchTerm("");
      },
      onError: (error) => {
        console.log("error->", error); // Log the error for debugging
        addToast(error.message || "Error deleting admin", "error");
      },
    }
  );

  const adminData = data?.getAllAdmins;

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

  if (networkStatus == 1) {
    return <NetworkStatusApollo />;
  }

  if (error) {
    return <ErrorApollo error={error} />;
  }

  //console.log("data->", adminData);
  console.log("confirmDelete->", confirmDelete);

  return (
    <>
      <section id="SuperAdminAdmin">
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
            <PinkCard
              title="Admin"
              icon={<UserRound size={16} strokeWidth={3} />}
              data={adminData}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleAddButton={handleAddButton}
            />
            {data &&
            data.getAllAdmins &&
            adminData &&
            data.getAllAdmins.length > 0 ? (
              adminData
                .filter((admin) =>
                  admin.userName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .sort((a, b) => a.userName.localeCompare(b.userName))
                .map((admin: Admin) => (
                  <>
                    <div className="card" key={admin.id}>
                      <div className="info">
                        <p className="highlight-yellow">{admin.userName}</p>
                        <div className="datetime">
                          <p className="text-s">
                            Created At:{" "}
                            <span className="highlight text-xs">
                              {new Date(parseInt(admin.createdAt))
                                .toLocaleString("en-IN", IST)
                                .replace(",", " -")}
                            </span>
                          </p>
                          <p className="text-s">
                            Updated At:{" "}
                            <span className="highlight text-xs">
                              {new Date(parseInt(admin.updatedAt))
                                .toLocaleString("en-IN", IST)
                                .replace(",", " -")}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="settings">
                        <button
                          title="Delete Admin"
                          id="delete-button"
                          onClick={() => {
                            if (confirmDelete?.id === admin.id) {
                              setConfirmDelete(null);
                            } else {
                              setConfirmDelete({ id: admin.id });
                            }
                          }}
                          disabled={deleteLoading}
                        >
                          {deleteLoading ? "Deleting..." : <Trash />}
                        </button>
                        <button
                          title="Update Admin"
                          id="settings-button"
                          onClick={() => {
                            handleUpdateButton(admin.userName, admin.id);
                          }}
                        >
                          <Settings />
                        </button>
                      </div>
                      {confirmDelete?.id === admin.id && (
                        <DynamicConfirmDelete
                          deleteTitle="Admin"
                          token={token}
                          deleteId={confirmDelete.id}
                          deleteFunction={deleteAdmin}
                          deleteLoading={deleteLoading}
                          cancelFunction={setConfirmDelete}
                        />
                      )}
                    </div>
                  </>
                ))
            ) : (
              <div className="card">No admins available.</div>
            )}
          </div>
        </div>
      </section>

      {functionType !== "" && (
        <DynamicAddUpdateAdminUserPopup
          setFunctionType={setFunctionType}
          handleSubmitFunction={
            functionType === "add" ? addAdminByToken : updateAdminById
          }
          id={updateId}
          error={addAdminError}
          userName={userName}
          password={password}
          confirmPassword={confirmPassword}
          setUserName={setUserName}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          loading={functionType === "add" ? addAdminLoading : updateLoading}
          title={functionType === "add" ? "Add Admin" : "Update Admin"}
          functionType={functionType}
          token={token}
        />
      )}
    </>
  );
};

export default SuperAdminAdmin;
