import { ApolloError } from "@apollo/client";

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
    <section id="SuperAdminAdmin">
      <div className="fg p-l">
        <p className="text-s">Loading...</p>
      </div>
    </section>
  );
};
