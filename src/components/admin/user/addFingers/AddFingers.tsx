import { RefreshCw, Trash, X } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  DELETE_FINGERPRINT_BY_FINGERPRINT_ID_BY_USER_TOKEN,
  GET_BATCH_BY_BATCH_ID_BY_USER,
  GET_USER,
} from "@/graphql/graphql-utils";
import { useToast } from "@/contexts/toastContext";

type Variables = {
  token: string;
  studentId: string;
  fingerPrints: FingerPrint[];
};

type Props = {
  fingerPrintOpen: { id: string } | null;
  setfingerPrintOpen: (value: { id: string } | null) => void;
  studentData: FingerPrint[];
  data: Student;
  token: string;
  handleAddFinger: (options: { variables: Variables }) => void;
  loading: boolean;
  slug: string;
};

type State = {
  [key: string]: boolean;
};

const AddFingers = ({
  fingerPrintOpen,
  setfingerPrintOpen,
  data,
  studentData,
  token,
  handleAddFinger,
  loading,
  slug,
}: Props) => {
  const [enhancedFiles, setEnhancedFiles] = useState<FingerPrint[]>([
    { image: "", scale: 1 },
  ]);
  const [unEnhancedFiles, setUnEnhancedFiles] = useState<FingerPrint[]>([
    { image: "", scale: 1 },
  ]);
  const [loadingFiles, setLoadingFiles] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [deleteLoadingStates, setDeleteLoadingStates] = useState<State>({});

  const { addToast } = useToast();

  //console.log("files->", enhancedFiles);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result.toString());
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleEnhacedImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    try {
      setLoadingFiles(true);
      let convertedFilesCount = 0;

      await Promise.all(
        Array.from(e.target.files).map(async (file, index) => {
          const base64 = await fileToBase64(file);
          convertedFilesCount++; // Increment the count for each converted file

          setEnhancedFiles((prevFiles) => {
            const newFiles = [...prevFiles];
            newFiles[index] = {
              image: base64,
              scale: 1,
            };
            return newFiles;
          });
        })
      );

      setStatusMessage(`${convertedFilesCount} file(s) converted to base64`);
    } catch (error) {
      console.error("Error converting file to base64:", error);
    } finally {
      setLoadingFiles(false);
    }
  };

  //console.log("data->", data);

  const handelSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      return;
    }

    const fingerprints = enhancedFiles.filter((file) => file.image);

    handleAddFinger({
      variables: {
        token,
        studentId: data.id,
        fingerPrints: fingerprints,
      },
    });
    setEnhancedFiles([{ image: "", scale: 1 }]);
    setUnEnhancedFiles([{ image: "", scale: 1 }]);
    setStatusMessage("");
  };

  const [deleteFingerprint, { loading: deleteLoading, error: deleteError }] =
    useMutation<FingerPrint>(
      DELETE_FINGERPRINT_BY_FINGERPRINT_ID_BY_USER_TOKEN,
      {
        onError: (error) => {
          console.log("error->", error);
          addToast(error.message || "Error deleting fingerprint", "error");
        },
        refetchQueries: [
          { query: GET_USER, variables: { token } },
          {
            query: GET_BATCH_BY_BATCH_ID_BY_USER,
            variables: { batchId: slug, token },
          },
        ],
        onCompleted: () => {
          addToast("Fingerprint deleted successfully", "success");
          setEnhancedFiles([{ image: "", scale: 1 }]);
          setUnEnhancedFiles([{ image: "", scale: 1 }]);
          setStatusMessage("");
        },
      }
    );

  const handleDelete = (fingerprintId: string | undefined) => {
    if (!fingerprintId) {
      console.error("Fingerprint ID is undefined.");
      return;
    }

    setDeleteLoadingStates((prev) => ({ ...prev, [fingerprintId]: true }));
    deleteFingerprint({
      variables: {
        token,
        fingerprintId,
      },
    });
  };

  return (
    <section
      id="addFingers"
      className="popup"
      onClick={() => setfingerPrintOpen(null)}
    >
      <div className="card" onClick={(e) => e.stopPropagation()}>
        <div className="title">
          <h4>Fingerprints</h4>
          <button
            title="Close Add Fingerprints"
            onClick={() => setfingerPrintOpen(null)}
          >
            <X />
          </button>
        </div>
        <form onSubmit={handelSubmit}>
          <p className="text-s">{data.studentName}:</p>
          {data.fingerprints.length > 0 && (
            <div className="existing-fingers">
              <p className="highlight">Existing Fingerprints:</p>
              <div className="images-container">
                {data.fingerprints
                  .slice() // Create a shallow copy to avoid mutating the original array
                  .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "")) // Provide a default value for name
                  .map((finger, i) => (
                    <div className="img-container" key={finger.id}>
                      <p className="text-xxs">{finger.name}</p>
                      <img src={finger.image} alt={finger.id} />
                      <button
                        title="Delete this Fingerprint"
                        type="button"
                        onClick={() => handleDelete(finger.id)}
                      >
                        {deleteLoadingStates[finger.id as string] ? (
                          <RefreshCw size={14} className="loader" />
                        ) : (
                          <Trash size={14} />
                        )}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
          <div className="form-field">
            <label className="highlight">Add Fingerprints:</label>
            <div className="buttons">
              <button
                title="Add Multiple Enhanced Fingerprints"
                type="button"
                className={`add ${
                  enhancedFiles.some((file) => file.image) ? "selected" : ""
                }`}
                onClick={() => {
                  const inputElement = document.getElementById(
                    "inputMultipleEnhanced"
                  ) as HTMLInputElement | null;
                  inputElement?.click();
                }}
              >
                {loadingFiles ? (
                  <RefreshCw size={24} className="loader" />
                ) : (
                  "+ Enhanced"
                )}
              </button>
              <input
                id="inputMultipleEnhanced"
                type="file"
                accept="image/*,.dib"
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files == null) return;
                  if (e.target.files.length == 0) return;
                  if (e.target.files[0] == null) return;

                  try {
                    Array.from(e.target.files).map(async (file, index) => {
                      //console.log("base64->", base64);
                      handleEnhacedImageChange(e, index);
                    });
                  } catch (error) {
                    console.log("error->", error);
                  }
                }}
              />
              <button
                title="Add Multiple Un-Enhanced Fingerprints"
                type="button"
                className={`add ${
                  unEnhancedFiles.some((file) => file.image) ? "selected" : ""
                }`}
                disabled
                //disabled={enhancedFiles.some((file) => file.image)}
                onClick={() => {
                  const inputElement = document.getElementById(
                    "inputMultipleUnEnhanced"
                  ) as HTMLInputElement | null;
                  inputElement?.click();
                }}
              >
                + UnEnhanced
              </button>
              <input
                id="inputMultipleUnEnhanced"
                type="file"
                accept="image/*,.dib"
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files == null) return;
                  if (e.target.files.length == 0) return;
                  if (e.target.files[0] == null) return;
                }}
              />
              <button
                title="Clear All Selected Fingerprints"
                type="button"
                className="clear"
                disabled={
                  loading ||
                  (!enhancedFiles.some((file) => file.image) &&
                    !unEnhancedFiles.some((file) => file.image))
                }
                onClick={() => {
                  setEnhancedFiles([{ image: "", scale: 1 }]);
                  setUnEnhancedFiles([{ image: "", scale: 1 }]);
                  setStatusMessage("");
                }}
              >
                Clear
              </button>
            </div>
          </div>
          {statusMessage !== "" && (
            <p className="info-text text-xs">Status: {statusMessage}</p>
          )}
          <button
            title="Add Fingerprints"
            type="submit"
            disabled={
              loading ||
              (!enhancedFiles.some((file) => file.image) &&
                !unEnhancedFiles.some((file) => file.image))
            }
          >
            {loading ? <RefreshCw size={24} className="loader" /> : "Add"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddFingers;
