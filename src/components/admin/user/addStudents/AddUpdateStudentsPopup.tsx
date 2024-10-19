"use client";

import { RefreshCw, X } from "lucide-react";
import { ApolloError } from "@apollo/client";
import { useEffect, useState } from "react";

type Variables = {
  aadhar_number?: string;
  studentName?: string;
  token: string;
  batchId?: string;
  details?: Details;
  students?: { studentName: string; aadhar_number: string; state: string[] }[];
  updateId?: string;
  state?: string[];
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
  aadhar_number: string;
  setAadharNumber: (value: string) => void;
  studentName: string;
  setStudentName: (value: string) => void;
  details?: Details;
  updateId?: string;
  errorMessage: string;
  setErrorMessage: (value: string) => void;
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
  setAadharNumber,
  studentName,
  setStudentName,
  details,
  updateId,
  errorMessage,
  setErrorMessage,
}: Props) => {
  const names = studentName.split("\n");
  const aadhars = String(aadhar_number).split("\n");

  const multipleformData = {
    students: names.map((studentName, i) => ({
      studentName,
      aadhar_number: aadhars[i],
      state: [],
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
            state: [],
          },
        });
        break;

      case "update":
        handleSubmitFunction({
          variables: {
            token,
            updateId,
            aadhar_number: aadhar_number.toString(),
            studentName,
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
      onClick={() => {
        setFunctionType("");
        setErrorMessage("");
      }}
    >
      <div className="card" onClick={(e) => e.stopPropagation()}>
        <div className="title">
          <h4>{title}</h4>
          <button
            title={`Close ${title}`}
            onClick={() => {
              setFunctionType("");
              setErrorMessage("");
            }}
          >
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {functionType === "add" || functionType === "update" ? (
            <>
              <div className="column-fields">
                <div className="form-field">
                  <label className="highlight">Name:</label>
                  <input
                    type="text"
                    placeholder="Student Name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="highlight">Aadhar:</label>
                  <input
                    type="text"
                    placeholder="Aadhar No. (last 8 digits)"
                    maxLength={8}
                    value={aadhar_number}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numericValue = value.replace(/[^0-9]/g, "");
                      setAadharNumber(numericValue);
                      //console.log("aadhar_number->", aadhar_number);
                    }}
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="column-fields">
              <div className="form-field">
                <label className="highlight">Name:</label>
                <textarea
                  placeholder="Enter Student Name Line by line"
                  required
                  rows={10}
                  value={studentName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setStudentName(value);
                  }}
                />
              </div>
              <div className="form-field">
                <label className="highlight">Aadhar:</label>
                <textarea
                  placeholder="Enter Last 8 Digit Aadhar No."
                  required
                  rows={10}
                  value={aadhar_number}
                  onChange={(e) => {
                    const value = e.target.value;
                    const lines = value.split("\n");

                    const validLines = lines.map((line) => {
                      return line.replace(/[^\d]/g, "").slice(0, 8);
                    });

                    const newValue = validLines.join("\n");

                    setAadharNumber(newValue);
                  }}
                />
              </div>
            </div>
          )}
          {errorMessage && <p className="error-text text-s">{errorMessage}</p>}
          <button title={title} type="submit">
            {loading ? <RefreshCw size={24} className="loader" /> : `${title}`}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddUpdateStudentsPopup;
