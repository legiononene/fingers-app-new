import { IST, IST_DATE_ONLY } from "@/utils/time";
import { X } from "lucide-react";

type Props = {
  openDetailsId: string;
  setOpenDetailsId: (value: string) => void;
  data: Student[];
};

const DetailsPopup = ({ openDetailsId, setOpenDetailsId, data }: Props) => {
  const student = data.find((student) => student.id === openDetailsId);

  if (!student)
    return (
      <section
        id="DetailsPopup"
        className="popup"
        onClick={() => setOpenDetailsId("")}
      >
        <div className="card" onClick={(e) => e.stopPropagation()}>
          <div className="title">
            <h4>No Students Found!</h4>
            <button
              title="Close Add Fingerprints"
              onClick={() => setOpenDetailsId("")}
            >
              <X />
            </button>
          </div>
        </div>
      </section>
    );

  return (
    <section
      id="DetailsPopup"
      className="popup"
      onClick={() => setOpenDetailsId("")}
    >
      <div className="card" onClick={(e) => e.stopPropagation()}>
        <div className="title">
          <h4>Details</h4>
          <button
            title="Close Add Fingerprints"
            onClick={() => setOpenDetailsId("")}
          >
            <X />
          </button>
        </div>
        <div className="detail_container">
          <p className="text-s">{student.studentName}:</p>
          {student.fingerprints.length > 0 && (
            <div className="existing-fingers">
              <p className="highlight">Existing Fingerprints:</p>
              <div className="images-container">
                {student.fingerprints.map((finger, i) => (
                  <div className="img-container" key={finger.id}>
                    <p className="text-xxs">{finger.name}</p>
                    <img src={finger.image} alt={finger.id} />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="stu_info">
            <p className="text-s">
              Created At:{" "}
              <span className="highlight text-xs">
                {new Date(parseInt(student.createdAt))
                  .toLocaleString("en-IN", IST)
                  .replace(",", " |")}
              </span>
            </p>
            <p className="text-s">
              Updated At:{" "}
              <span className="highlight text-xs">
                {new Date(parseInt(student.updatedAt))
                  .toLocaleString("en-IN", IST)
                  .replace(",", " |")}
              </span>
            </p>
            <p className="text-s">
              ID type:{" "}
              <span className="highlight text-xs">
                {student.details?.idType}
              </span>
            </p>
            <p className="text-s">
              Aadhar No:{" "}
              <span className="highlight text-xs">
                {student.aadhar_number}{" "}
                {student.details && `| ${student.details?.aadhar_number}`}
              </span>
            </p>
            <p className="text-s">
              Mobile No:{" "}
              <span className="highlight text-xs">
                {student.details?.mobile}
              </span>
            </p>
            <p className="text-s">
              Email:{" "}
              <span className="highlight text-xs">
                {student.details?.email}
              </span>
            </p>
            <p className="text-s">
              DOB:{" "}
              <span className="highlight text-xs">
                {student.details?.dob &&
                  new Date(parseInt(student.details?.dob)).toLocaleDateString(
                    "en",
                    IST_DATE_ONLY
                  )}
              </span>
            </p>
            <p className="text-s">
              Gender:{" "}
              <span className="highlight text-xs">
                {student.details?.gender}
              </span>
            </p>
            <p className="text-s">
              Marital Status:{" "}
              <span className="highlight text-xs">
                {student.details?.maritalStatus}
              </span>
            </p>
            <p className="text-s">
              Father Guardian:{" "}
              <span className="highlight text-xs">
                {student.details?.fatherGuardian}
              </span>
            </p>
            <p className="text-s">
              Mother Guardian:{" "}
              <span className="highlight text-xs">
                {student.details?.motherGuardian}
              </span>
            </p>
            <p className="text-s">
              Religion:{" "}
              <span className="highlight text-xs">
                {student.details?.religion}
              </span>
            </p>
            <p className="text-s">
              Cast Category:{" "}
              <span className="highlight text-xs">
                {student.details?.castCategory}
              </span>
            </p>
            {student.details?.disability && (
              <>
                <p className="text-s">
                  Disability:{" "}
                  <span className="highlight text-xs">
                    {student.details?.disability === true && "Yes"}
                  </span>
                </p>
                <p className="text-s">
                  Disability Type:{" "}
                  <span className="highlight text-xs">
                    {student.details?.disabilityType}
                  </span>
                </p>
              </>
            )}
            {student.details?.employed && (
              <>
                <p className="text-s">
                  Disability:{" "}
                  <span className="highlight text-xs">
                    {student.details?.employed === true && "Yes"}
                  </span>
                </p>
                <p className="text-s">
                  Employment Status:{" "}
                  <span className="highlight text-xs">
                    {student.details?.employmentStatus}
                  </span>
                </p>
                <p className="text-s">
                  Employment Details:{" "}
                  <span className="highlight text-xs">
                    {student.details?.employmentDetails}
                  </span>
                </p>
              </>
            )}
            <p className="text-s">
              Training Program:{" "}
              <span className="highlight text-xs">
                {student.details?.trainingProgram}
              </span>
            </p>
            <p className="text-s">
              Address:{" "}
              <span className="highlight text-xs">
                {student.details?.address}
              </span>
            </p>
            <p className="text-s">
              pincode:{" "}
              <span className="highlight text-xs">
                {student.details?.pincode}
              </span>
            </p>

            <p className="text-s">
              Education Level:{" "}
              <span className="highlight text-xs">
                {student.details?.educationLevel}
              </span>
            </p>
            <p className="text-s">
              Domicile State:{" "}
              <span className="highlight text-xs">
                {student.details?.domicileState}
              </span>
            </p>
            <p className="text-s">
              Domicile District:{" "}
              <span className="highlight text-xs">
                {student.details?.domicileDistrict}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailsPopup;
