import Logout from "@/components/auth/logout/Logout";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <Logout />
    </>
  );
}
