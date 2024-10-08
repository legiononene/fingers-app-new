import UserBatch from "@/components/admin/user/user-batches/user-batch/UserBatch";

type Props = {
  params: { batch: string };
};

const page = ({ params }: Props) => {
  const slug = params.batch;

  return <UserBatch slug={slug} />;
};

export default page;
