"use client";

import {
  ADD_DETAILS_TO_STUDENT_BY_STUDENT_ID_BY_USER_TOKEN,
  UPDATE_DETAILS_OF_STUDENT_BY_STUDENT_ID_BY_USER_TOKEN,
} from "@/graphql/graphql-utils";
import { RefreshCw, X } from "lucide-react";
import { useMutation } from "@apollo/client";
import { useToast } from "@/contexts/toastContext";
import { useEffect, useState } from "react";

type DetailsHere = {
  aadhar_number: string;
  mobile: string;
  email: string;
  address: string;
  domicileState: string;
  domicileDistrict: string;
  idType: string;
  dob: Date | null;
  gender: string;
  maritalStatus: string;
  fatherGuardian: string;
  motherGuardian: string;
  religion: string;
  castCategory: string;
  disability: boolean;
  disabilityType?: string;
  employed: boolean;
  employmentStatus?: string;
  employmentDetails?: string;
  trainingProgram: string;
  pincode?: number;
  educationLevel?: string;
};

type Props = {
  studentId: string;
  setStudentId: (id: string) => void;
  token: string;
  setFunctionType: (value: "add" | "update" | "") => void;
  functionType: string;
  setStatusMessage: (message: string) => void;
  setStudentDetails: (details: Details) => void;
  statusMessage: string;
  title: string;
  studentDetails: Details;
  detailsId: string | undefined;
  addDetailsToStudent: (options: {
    variables: { token: string; studentId: string; details: DetailsHere };
  }) => void;
  updateDetailsOfStudent: (options: {
    variables: {
      token: string;
      detailsId: string | undefined;
      details: DetailsHere;
    };
  }) => void;
  addDetailsLoading: boolean;
  updateDetailsLoading: boolean;
};

const AddDetails = ({
  setStudentDetails,
  studentDetails,
  title,
  studentId,
  setStudentId,
  token,
  functionType,
  setFunctionType,
  setStatusMessage,
  statusMessage,
  detailsId,
  addDetailsToStudent,
  updateDetailsOfStudent,
  addDetailsLoading,
  updateDetailsLoading,
}: Props) => {
  const [details, setDetails] = useState<Details>(studentDetails);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setStatusMessage("Token not provided!");
      return;
    }

    switch (functionType) {
      case "add":
        addDetailsToStudent({
          variables: {
            token,
            studentId: studentId,
            details,
          },
        });
        break;
      case "update":
        updateDetailsOfStudent({
          variables: {
            token,
            detailsId: detailsId,
            details,
          },
        });
        break;
      default:
        return;
    }
  };

  useEffect(() => {
    if (functionType === "add") {
      resetForm();
    } else {
      setDetails(studentDetails);
    }
  }, [functionType, studentDetails]);

  const resetForm = () => {
    setDetails({
      aadhar_number: "",
      address: "",
      castCategory: "",
      disability: false,
      disabilityType: "",
      dob: new Date(),
      domicileDistrict: "",
      domicileState: "",
      email: "",
      employed: false,
      employmentDetails: "",
      employmentStatus: "",
      fatherGuardian: "",
      gender: "",
      idType: "",
      maritalStatus: "",
      mobile: "",
      motherGuardian: "",
      religion: "",
      trainingProgram: "",
    });
    setStatusMessage("");
  };

  return (
    <section
      id="AddDetails"
      className="popup"
      onClick={() => {
        setFunctionType("");
        setStatusMessage("");
      }}
    >
      <div className="card" onClick={(e) => e.stopPropagation()}>
        <div className="title">
          <h4>{title}</h4>
          <button
            title="Close Add Details"
            onClick={() => {
              setFunctionType("");
              setStatusMessage("");
            }}
          >
            <X />
          </button>
        </div>

        <form className="deatils_form" onSubmit={handleSubmit}>
          <div className="scrollable_area">
            <div className="column-fields">
              <div className="form-field">
                <label>Aadhar Number:</label>
                <input
                  type="text"
                  placeholder="Enter Full Aadhar Number"
                  required
                  value={details.aadhar_number || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,12}$/.test(value)) {
                      setDetails((prevDetails) => ({
                        ...prevDetails,
                        aadhar_number: value,
                      }));
                    }
                  }}
                  maxLength={12}
                  pattern="\d{12}"
                />
              </div>
              <div className="form-field">
                <label>Phone Number:</label>
                <input
                  type="text"
                  placeholder="Enter 10 Digit Mobile Number"
                  value={details.mobile}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,10}$/.test(value)) {
                      setDetails((prevDetails) => ({
                        ...prevDetails,
                        mobile: value,
                      }));
                    }
                  }}
                  maxLength={10}
                  pattern="\d{10}"
                />
              </div>
            </div>
            <div className="column-fields">
              <div className="form-field">
                <label>Gender:</label>
                <input
                  type="text"
                  placeholder="Enter Gender"
                  value={details.gender}
                  onChange={(e) =>
                    setDetails((prevDetails) => ({
                      ...prevDetails,
                      gender: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="form-field">
                <label>DOB</label>
                <input
                  type="date"
                  placeholder="Enter Date of Birth"
                  value={(() => {
                    if (
                      !isNaN(Number(details.dob)) &&
                      !isNaN(new Date(Number(details.dob)).getTime())
                    ) {
                      return new Date(Number(details.dob))
                        .toISOString()
                        .split("T")[0];
                    }

                    return new Date(details.dob).toISOString().split("T")[0];
                  })()}
                  onChange={(e) => {
                    setDetails((prevDetails) => ({
                      ...prevDetails,
                      dob: new Date(e.target.value),
                    }));
                  }}
                />
              </div>
            </div>
            <div className="column-fields">
              <div className="form-field">
                <label>Email:</label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={details.email}
                  onChange={(e) =>
                    setDetails((prevDetails) => ({
                      ...prevDetails,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="form-field">
                <label>Marital Status:</label>
                <input
                  type="text"
                  placeholder="Enter Marital Status"
                  value={details.maritalStatus}
                  onChange={(e) =>
                    setDetails((prevDetails) => ({
                      ...prevDetails,
                      maritalStatus: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="column-fields">
              <div className="form-field">
                <label>Father's Name:</label>
                <input
                  type="text"
                  placeholder="Enter Father's Name"
                  value={details.fatherGuardian}
                  onChange={(e) =>
                    setDetails((prevDetails) => ({
                      ...prevDetails,
                      fatherGuardian: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="form-field">
                <label>Mother's Name:</label>
                <input
                  type="text"
                  placeholder="Enter Mother's Name"
                  value={details.motherGuardian}
                  onChange={(e) =>
                    setDetails((prevDetails) => ({
                      ...prevDetails,
                      motherGuardian: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="column-fields">
              <div className="form-field">
                <label>Religion:</label>
                <input
                  type="text"
                  placeholder="Enter Religion"
                  value={details.religion}
                  onChange={(e) =>
                    setDetails((prevDetails) => ({
                      ...prevDetails,
                      religion: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="form-field">
                <label>Category:</label>
                <input
                  type="text"
                  placeholder="Gen/OBC/SC/ST"
                  value={details.castCategory}
                  onChange={(e) =>
                    setDetails((prevDetails) => ({
                      ...prevDetails,
                      castCategory: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="column-fields">
              <div className="form-field">
                <label>Disability:</label>
                <select
                  value={String(details.disability)}
                  onChange={(e) =>
                    setDetails((prevDetails) => ({
                      ...prevDetails,
                      disability: e.target.value === "true",
                    }))
                  }
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <div className="form-field">
                <label>Type of Disability:</label>
                <input
                  type="text"
                  placeholder="Enter Type of Disability"
                  disabled={!details.disability}
                  value={details.disabilityType || ""}
                  onChange={(e) =>
                    setDetails((prevDetails) => ({
                      ...prevDetails,
                      disabilityType: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="column-fields">
              <div className="form-field">
                <label>Domicile State:</label>
                <input
                  type="text"
                  placeholder="Enter Domicile State"
                  value={details.domicileState}
                  onChange={(e) =>
                    setDetails((prevDetails) => ({
                      ...prevDetails,
                      domicileState: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="form-field">
                <label>Domicile District:</label>
                <input
                  type="text"
                  placeholder="Enter Domicile District"
                  value={details.domicileDistrict}
                  onChange={(e) =>
                    setDetails((prevDetails) => ({
                      ...prevDetails,
                      domicileDistrict: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="column-fields">
              <div className="form-field">
                <label>ID Type:</label>
                <input
                  type="text"
                  placeholder="Enter ID Type"
                  value={details.idType}
                  onChange={(e) =>
                    setDetails((prevDetails) => ({
                      ...prevDetails,
                      idType: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="form-field">
                <label>Employed:</label>
                <select
                  value={String(details.employed)}
                  onChange={(e) =>
                    setDetails((prevDetails) => ({
                      ...prevDetails,
                      employed: e.target.value === "true",
                    }))
                  }
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>
            <div className="column-fields">
              <div className="form-field">
                <label>Employment Details:</label>
                <input
                  type="text"
                  placeholder="Enter Employment Details"
                  disabled={!details.employed}
                  value={details.employmentDetails || ""}
                  onChange={(e) =>
                    setDetails((prevDetails) => ({
                      ...prevDetails,
                      employmentDetails: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="form-field">
                <label>Employment Status:</label>
                <input
                  type="text"
                  placeholder="Enter Employment Status"
                  disabled={!details.employed}
                  value={details.employmentStatus || ""}
                  onChange={(e) =>
                    setDetails((prevDetails) => ({
                      ...prevDetails,
                      employmentStatus: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="form-field">
              <label>Training Program:</label>
              <input
                type="text"
                placeholder="Enter Training Program"
                value={details.trainingProgram}
                onChange={(e) =>
                  setDetails((prevDetails) => ({
                    ...prevDetails,
                    trainingProgram: e.target.value,
                  }))
                }
              />
            </div>
            <div className="form-field">
              <label>Address:</label>
              <input
                type="text"
                placeholder="Enter Address"
                value={details.address}
                onChange={(e) =>
                  setDetails((prevDetails) => ({
                    ...prevDetails,
                    address: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          {statusMessage !== "" && (
            <p className="info-text text-xs">Status: {statusMessage}</p>
          )}
          <button
            type="button"
            onClick={resetForm}
            disabled={addDetailsLoading || updateDetailsLoading}
          >
            Reset
          </button>
          <button type="submit">
            {addDetailsLoading || updateDetailsLoading ? (
              <RefreshCw size={24} className="loader" />
            ) : (
              `${title}`
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddDetails;
