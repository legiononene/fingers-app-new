"use client";

import { Eye, EyeOff, RefreshCw, X } from "lucide-react";
import { useState } from "react";
import { ApolloError } from "@apollo/client";
import { useToast } from "@/contexts/toastContext";

type Variables = {
  updateAdminId?: string;
  userName: string;
  password: string;
  token: string;
};

type Props = {
  setFunctionType: (value: "add" | "update" | "") => void;
  functionType: string;
  handleSubmitFunction: (options: { variables: Variables }) => void;
  id?: string;
  userName: string;
  password: string;
  confirmPassword: string;
  setUserName: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  error: ApolloError | undefined;
  loading: boolean;
  title: string;
  token: string | null;
};

const AddUpdateAdminUserPopup = ({
  setFunctionType,
  functionType,
  handleSubmitFunction,
  id,
  userName,
  password,
  confirmPassword,
  setUserName,
  setPassword,
  setConfirmPassword,
  error,
  loading,
  title,
  token,
}: Props) => {
  const [openPassword, setOpenPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addToast("Passwords do not match", "info");
      setErrorMessage("Passwords do not match");
      return;
    }
    if (functionType === "add" && token) {
      handleSubmitFunction({
        variables: {
          userName,
          password,
          token,
        },
      });
    } else if (functionType === "update" && token) {
      handleSubmitFunction({
        variables: {
          updateAdminId: id,
          userName,
          password,
          token,
        },
      });
    } else {
      return;
    }
    setErrorMessage("");
  };

  console.log("id->", id);
  return (
    <section
      id="addAdminPopup"
      className="popup"
      onClick={() => setFunctionType("")}
    >
      <div className="card" onClick={(e) => e.stopPropagation()}>
        <div className="title">
          <h4>{title}</h4>
          <button onClick={() => setFunctionType("")}>
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="highlight">Username:</label>
            <input
              type="text"
              placeholder="Enter username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label className="highlight">Password:</label>
            <input
              type={openPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type={openPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setOpenPassword(!openPassword)}
            >
              {openPassword ? <EyeOff /> : <Eye />}
            </button>
            {errorMessage && (
              <p className="error-text text-s">{errorMessage}</p>
            )}
            {error && !errorMessage && (
              <p className="error-text text-s">Error: {error.message}</p>
            )}
          </div>
          <button type="submit">
            {loading ? <RefreshCw size={24} className="loader" /> : `${title}`}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddUpdateAdminUserPopup;
