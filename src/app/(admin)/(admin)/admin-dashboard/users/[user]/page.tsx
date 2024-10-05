import AdminUser from "@/components/admin/admin-admin/admin-users/admin-user/AdminUser";

type Props = {
  params: { user: string };
};

const page = ({ params }: Props) => {
  const slug = params.user;

  //console.log("slug->", slug);

  return <AdminUser slug={slug && slug} />;
};

export default page;
