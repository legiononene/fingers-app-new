import "@/components/admin/dashboard.scss";

const PageNotFound = () => {
  return (
    <section id="Dashboard">
      <div
        className="fg dashLoader"
        style={{
          height: "calc(100svh - 3.313rem - 0.625rem - 0.625rem - 0.625rem)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.2rem",
        }}
      >
        <h1 className="highlight">404</h1>
        <p>Page Not Found</p>
      </div>
    </section>
  );
};

export default PageNotFound;
