"use client";

import { RefreshCw, X } from "lucide-react";
import { ApolloError } from "@apollo/client";
import { useState } from "react";

type Variables = {
  aadhar_number?: number;
  studentName?: string;
  token: string;
  batchId: string;
  details?: Details;
  students?: { studentName: string; aadhar_number: number }[];
  studentId?: string;
};

type Props = {
  functionType: "add" | "update" | "addMultiple" | "";
  setFunctionType: (value: "add" | "update" | "addMultiple" | "") => void;
  title: string;
  loading: boolean;
  error: ApolloError | undefined;
  token: string | null;
  handleSubmitFunction: (options: { variables: Variables }) => void;
  batchId: string;
  aadhar_number: number;
  studentName: string;
  details?: Details;
  studentId?: string;
};

const AddUpdateStudentsPopup = ({
  functionType,
  setFunctionType,
  handleSubmitFunction,
  title,
  loading,
  error,
  token,
  batchId,
  aadhar_number,
  studentName,
  details,
  studentId,
}: Props) => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const names = studentName.split("\n");
  const aadhars = String(aadhar_number).split("\n");

  const multipleformData = {
    batchId,
    students: names.map((studentName, i) => ({
      studentName,
      aadhar_number: parseInt(aadhars[i]),
    })),
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      return;
    }

    switch (functionType) {
      case "addMultiple":
        handleSubmitFunction({
          variables: {
            token,
            batchId,
            students: multipleformData.students,
          },
        });
        break;

      case "add":
        handleSubmitFunction({
          variables: {
            token,
            batchId,
            aadhar_number,
            studentName,
            details: details,
          },
        });
        break;

      case "update":
        handleSubmitFunction({
          variables: {
            token,
            batchId,
            studentId,
            aadhar_number,
            studentName,
            details: details,
          },
        });
        break;

      default:
        return;
    }

    setErrorMessage("");
  };

  return (
    <section
      id="addStudentsPopup"
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
          <div className="column-fields">
            <div className="form-field">
              <label className="highlight">Name:</label>
              <textarea
                placeholder="Enter Student Name Line by line"
                required
                rows={10}
              />
            </div>
            <div className="form-field">
              <label className="highlight">Aadhar:</label>
              <textarea
                placeholder="Enter Last 8 Digit Aadhar No."
                required
                rows={10}
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

export default AddUpdateStudentsPopup;
