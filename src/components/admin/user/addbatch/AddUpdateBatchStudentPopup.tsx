"use client";

import { RefreshCw, X } from "lucide-react";
import { useState } from "react";
import { ApolloError } from "@apollo/client";

type Variables = {
  outTime: string;
  batchName: string;
  inTime: string;
  token: string;
  updateId?: string;
};

type Props = {
  setFunctionType: (value: "add" | "update" | "") => void;
  title: string;
  functionType: string;
  token: string | null;
  handleSubmitFunction: (options: { variables: Variables }) => void;
  batchName: string;
  inTime: string;
  outTime: string;
  updateId: string;
  setBatchName: (value: string) => void;
  setBatchInTime: (value: string) => void;
  setBatchOutTime: (value: string) => void;
  error: ApolloError | undefined;
  loading: boolean;
};

const AddUpdateBatchStudentPopup = ({
  setFunctionType,
  title,
  functionType,
  token,
  handleSubmitFunction,
  batchName,
  inTime,
  outTime,
  updateId,
  setBatchName,
  setBatchInTime,
  setBatchOutTime,
  error,
  loading,
}: Props) => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (functionType === "add" && token) {
      handleSubmitFunction({
        variables: {
          batchName,
          inTime,
          outTime,
          token,
        },
      });
    } else if (functionType === "update" && token) {
      handleSubmitFunction({
        variables: {
          batchName,
          inTime,
          outTime,
          token,
          updateId,
        },
      });
    } else {
      return;
    }

    setErrorMessage("");
  };

  return (
    <section
      id="addBatchPopup"
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
            <label className="highlight">Batch Name:</label>
            <input
              type="text"
              placeholder="Enter Batch Name"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              required
            />
          </div>
          <label className="highlight">Batch Time:</label>
          <div className="time-fields">
            <div className="form-field">
              <input
                type="text"
                placeholder="IN Time"
                value={inTime}
                onChange={(e) => setBatchInTime(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <input
                type="text"
                placeholder="OUT Time"
                value={outTime}
                onChange={(e) => setBatchOutTime(e.target.value)}
                required
              />
            </div>
          </div>
          {errorMessage && <p className="error-text text-s">{errorMessage}</p>}
          {error && !errorMessage && (
            <p className="error-text text-s">Error: {error.message}</p>
          )}
          <button type="submit">
            {loading ? <RefreshCw size={24} className="loader" /> : `${title}`}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddUpdateBatchStudentPopup;
