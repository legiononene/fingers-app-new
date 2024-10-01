import "./style.scss";

type Props = {
  role: string;
  userName: string;
};

const DashboardTitle = ({ role, userName }: Props) => {
  return (
    <div id="title">
      <h3>{role} Dashboard</h3>
      <h5 className="highlight">{userName}</h5>
    </div>
  );
};

export default DashboardTitle;
