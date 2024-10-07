import { Search, UserRoundPlus } from "lucide-react";

type Props = {
  title: string | undefined;
  icon: React.ReactNode;
  data: Admin[] | User[] | Batch[] | Student[] | undefined;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  handleAddButton?: () => void;
};

const PinkCard = ({
  title,
  icon,
  data,
  searchTerm,
  setSearchTerm,
  handleAddButton,
}: Props) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const isStudentArray = (arr: any[]): arr is Student[] =>
    arr.length > 0 && "aadhar_number" in arr[0];
  //console.log("data->", data);
  const placeHolder =
    Array.isArray(data) && isStudentArray(data)
      ? "Search by Name or Aadhar..."
      : "Search by Name...";

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
          <Search className="search-icon" />
        </div>
      </div>
      {handleAddButton && (
        <button id="add-button" onClick={handleAddButton}>
          <UserRoundPlus />
        </button>
      )}
    </div>
  );
};

export default PinkCard;
