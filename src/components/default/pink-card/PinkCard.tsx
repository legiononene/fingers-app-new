import {
  RefreshCw,
  Search,
  ShieldPlus,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";

type Props = {
  title: string | undefined;
  icon: React.ReactNode;
  data: Admin[] | User[] | Batch[] | Student[] | undefined;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  handleAddButton?: () => void;
  handleAddMultipleButton?: () => void;
  loading?: boolean;
};

const PinkCard = ({
  title,
  icon,
  data,
  searchTerm,
  setSearchTerm,
  handleAddButton,
  handleAddMultipleButton,
  loading = false,
}: Props) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  //console.log("data->", data);

  const isStudentArray = (arr: any[]): arr is Student[] =>
    arr.length > 0 && "aadhar_number" in arr[0];

  const isBatchArray = (arr: any[]): arr is Batch[] =>
    arr.length > 0 && "batchName" in arr[0];

  const placeHolder =
    Array.isArray(data) && isStudentArray(data)
      ? "Search by Name or Aadhar..."
      : "Search by Name...";

  const AddButtonIcon =
    Array.isArray(data) && isBatchArray(data) ? (
      <ShieldPlus />
    ) : (
      <UserRoundPlus />
    );

  return (
    <div className="pink-card">
      <div className="title">
        <h5>
          {icon}
          {title}: <span>{data ? data.length : "None"}</span>
        </h5>
        <div className="input-block">
          <input
            type="text"
            placeholder={placeHolder}
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {loading ? (
            <RefreshCw
              size={18}
              strokeWidth={3}
              className="loader search-icon"
            />
          ) : (
            <Search className="search-icon" />
          )}
        </div>
      </div>
      <div className="buttons">
        {handleAddButton && (
          <button
            title={`Add ${
              Array.isArray(data) && isStudentArray(data) ? "Student" : title
            }`}
            id="add-button"
            onClick={handleAddButton}
          >
            {AddButtonIcon}
          </button>
        )}
        {handleAddMultipleButton && (
          <button
            title="Add Multiple Students"
            id="add-button"
            onClick={handleAddMultipleButton}
          >
            <UsersRound />
          </button>
        )}
      </div>
    </div>
  );
};

export default PinkCard;
