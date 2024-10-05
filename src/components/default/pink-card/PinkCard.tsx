import { UserRoundPlus } from "lucide-react";

type Props = {
  title: string | undefined;
  icon: React.ReactNode;
  data: Admin[] | User[] | Batch[] | undefined;
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

  return (
    <div className="pink-card">
      <div className="title">
        <h5>
          {icon}
          {title}: <span>{data ? data.length : "None"}</span>
        </h5>
        <input
          type="text"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
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
