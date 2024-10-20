import { RefreshCw } from "lucide-react";

export const DynamicPopupLoader = () => {
  return (
    <section className="popup">
      <div className="card">
        <div className="title">
          Loading <RefreshCw size={24} className="loader" />
        </div>
      </div>
    </section>
  );
};

export const DynamicConfirmDeleteLoader = () => {
  return (
    <div className="confirm-delete">
      <p className="info-text">
        Loading <RefreshCw size={24} className="loader" />
      </p>
    </div>
  );
};

export const DynamicAssignLoader = () => {
  return (
    <div className="asign">
      <p className="info-text">
        Loading <RefreshCw size={24} className="loader" />
      </p>
    </div>
  );
};
