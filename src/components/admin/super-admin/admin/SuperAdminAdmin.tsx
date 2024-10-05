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
import AddUpdateAdminUserPopup from "./addAdmin/AddUpdateAdminUserPopup";
import {
  ADD_ADMIN,
  DELETE_ADMIN,
  GET_ALL_ADMINS,
  UPDATE_ADMIN,
} from "@/graphql/graphql-utils";

type Data = {
  getAllAdmins: Admin[] | undefined;
};

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
  const [token, setToken] = useState<string | null>(null);

  const { addToast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    }
  }, []);

  const { data, error, networkStatus } = useQuery<Data>(GET_ALL_ADMINS, {
    variables: {
      token,
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
                          id="settings-button"
                          onClick={() => {
                            handleUpdateButton(admin.userName, admin.id);
                          }}
                        >
                          <Settings />
                        </button>
                      </div>
                      {confirmDelete?.id === admin.id && (
                        <div className="confirm-delete">
                          <p className="info-text">
                            Are you sure you want to delete this admin?
                          </p>
                          <div className="buttons">
                            <button
                              onClick={() => {
                                deleteAdmin({
                                  variables: {
                                    token: token,
                                    adminId: admin.id,
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
                  </>
                ))
            ) : (
              <div className="card">No admins available.</div>
            )}
          </div>
        </div>
      </section>

      {functionType !== "" && (
        <AddUpdateAdminUserPopup
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
