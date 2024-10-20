import { ApolloError } from "@apollo/client";
import { RefreshCw } from "lucide-react";
import "@/components/admin/dashboard.scss";

type Props = {
  error: ApolloError;
};

export const ErrorApollo = ({ error }: Props) => {
  return (
    <section id="SuperAdminAdmin">
      <div className="fg p-l">
        <p className="text-s red">Error: {error.message}</p>
      </div>
    </section>
  );
};

export const NoData = ({ type }: { type: string }) => {
  return (
    <section id="SuperAdminAdmin">
      <div className="fg p-l">
        <p className="text-s">No {type} available</p>
      </div>
    </section>
  );
};

export const NetworkStatusApollo = () => {
  return (
    <section id="Dashboard">
      <div
        className="fg dashLoader"
        style={{
          height: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.625rem",
        }}
      >
        Loading <RefreshCw size={24} className="loader" />
      </div>
    </section>
  );
};
