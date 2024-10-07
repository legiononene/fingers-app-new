import AdminBatch from "@/components/admin/admin-admin/admin-users/admin-user/admin-batch/AdminBatch";

type Props = {
  params: { batch: string };
};

const page = ({ params }: Props) => {
  const slug = params.batch;
  return <AdminBatch slug={slug} />;
};

export default page;
